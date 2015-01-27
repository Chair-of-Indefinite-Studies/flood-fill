;(function(sprite, undefined){
    /* A flood fill tool for the sprite editor */
    sprite.flood = {};
    sprite.flood.fill = {};

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

    var Flooder = sprite.flood.fill.Flooder = function(model){
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
})(window.sprite = window.sprite || {})
