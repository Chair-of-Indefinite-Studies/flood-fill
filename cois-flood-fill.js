;(function(sprite, undefined){
    /* A flood fill tool for the sprite editor */
    var flood = sprite.flood = {};
    var fill = flood.fill = {};

    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.neighbours = function(){
        return [
            new Point(this.x - 1, this.y),
            new Point(this.x + 1, this.y),
            new Point(this.x, this.y - 1),
            new Point(this.x, this.y + 1)
        ];
    }
    Point.prototype.admissable = function(model){
        return this.x >= 0 && this.x < model.columns && this.y >= 0 && this.y < model.rows;
    }

    var History = function(){
        this.visitedPoints = {};
    }
    History.prototype.visited = function(point){
        return this.visitedPoints[point.x] && this.visitedPoints[point.x][point.y];
    }
    History.prototype.visit = function(point){
        this.visitedPoints[point.x] = this.visitedPoints[point.x] || {};
        this.visitedPoints[point.x][point.y] = true;
    }

    var Flooder = fill.Flooder = function(model){
        this.model = model;
    };
    Flooder.prototype.flood = function(x, y) {
        var toVisit = [new Point(x, y)];
        var toVisitIndex = 0;
        var history = new History();
        var originalColor = this.model.colorAt(x, y);
        while (toVisitIndex < toVisit.length) {
            var point = toVisit[toVisitIndex++];
            if (!history.visited(point)) {
                history.visit(point);
                point.neighbours().filter(function(neighbour){
                    return neighbour.admissable(this.model) &&
                        this.model.colorAt(neighbour.x, neighbour.y) === originalColor;
                }.bind(this)).forEach(function(neighbour){
                    toVisit.push(neighbour);
                });
            }
        }
        toVisit.forEach(function(point){
            this.model.paintPixel(point.x, point.y);
        }.bind(this));
    }

    var Controller = function(model, view, canvas){
        this.flooder = new Flooder(model);
        this.model = model;
        this.view = view;
        this.canvas = canvas;
        this.boundReceiveFloodEvent = this.receiveFloodEvent.bind(this);
    };
    Controller.prototype.startDrawing = function(event){
        this.boundReceiveFloodEvent(event);
    };
    Controller.prototype.stopDrawing = function(event){
        /* do nothing */
    };
    Controller.prototype.receiveFloodEvent = function(event){
        var x = event.clientX - this.view.horizontalOffset - this.canvas.offsetLeft;
        var y = event.clientY - this.view.verticalOffset - this.canvas.offsetTop;

        var column = Math.floor(x/this.view.pixelSize);
        var row = Math.floor(y/this.view.pixelSize);

        try {
            this.flooder.flood(column, row);
        } catch(e) {
            if (!e.message.match(/^Not within bounds/)) {
                throw e;
            }
        }
    };

    fill.controllerFor = function(model, view, canvas){
        return new Controller(model, view, canvas);
    };
})(window.sprite = window.sprite || {})
