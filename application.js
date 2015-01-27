(function(sprite){
	var model = new sprite.editor.Model(20, 30);
    for (var column = 0; column < model.columns; column++) {
        model.paintPixel(column, 15);
    }
    model.changeBrushColor('red');

	var canvas = document.getElementById('pixel-editor');
	var view = new sprite.editor.View(model, canvas);
	var controller = sprite.flood.fill.controllerFor(model, view, canvas);


	canvas.addEventListener('mousedown', controller.startDrawing.bind(controller));
	canvas.addEventListener('mouseup', controller.stopDrawing.bind(controller));

	[
		{ 'id': 'decrease-row', 'callback': function(){ model.decreaseRows() } },
		{ 'id': 'increase-row', 'callback': function(){ model.increaseRows() } },
		{ 'id': 'decrease-column', 'callback': function(){ model.decreaseColumns() } },
		{ 'id': 'increase-column', 'callback': function(){ model.increaseColumns() } },
	].forEach(function(data){
		var element = document.getElementById(data.id);
		element.addEventListener('click', data.callback);
	});
})(sprite);
