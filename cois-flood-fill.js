;(function(sprite, undefined){
    /* A flood fill tool for the sprite editor */
    var flood = sprite.flood = {};
    var fill = flood.fill = {};

    function floodAlgorithm(model, x, y, originalColor){
        model.paintPixel(x, y, false);
        if (x - 1 >= 0 && model.colorAt(x - 1, y) === originalColor) {
            floodAlgorithm(model, x - 1, y, originalColor);
        }
        if (x + 1 < model.columns && model.colorAt(x + 1, y) === originalColor) {
            floodAlgorithm(model, x + 1, y, originalColor);
        }
        if (y - 1 >= 0 && model.colorAt(x, y - 1) === originalColor) {
            floodAlgorithm(model, x, y - 1, originalColor);
        }
        if (y + 1 < model.rows && model.colorAt(x, y + 1) === originalColor) {
            floodAlgorithm(model, x, y + 1, originalColor);
        }

    }

    var Flooder = fill.Flooder = function(model){
        this.model = model;
    };
    Flooder.prototype.flood = function(x, y) {
        floodAlgorithm(this.model, x, y, this.model.colorAt(x, y));
        this.model.refresh();
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

        this.flooder.flood(column, row);
    };

    fill.controllerFor = function(model, view, canvas){
        return new Controller(model, view, canvas);
    };
})(window.sprite = window.sprite || {})
