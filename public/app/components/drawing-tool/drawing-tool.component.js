(function () {
	'use strict';

	window.drawingDemo.component('drawingTool',
		{
			templateUrl: 'app/components/drawing-tool/drawing-tool.tpl.html',
			controller: [DrawingToolCtrl]
		});

	function DrawingToolCtrl() {
		const DRAWING_MODES = {
			FREE_DRAWING: 'freeDrawing',
			ERASING: 'erasing',
			SELECT_PATH: 'selectPath'
		};

		var ctrl = this;

		var canvas = undefined;

		ctrl.DRAWING_MODES = DRAWING_MODES;

		ctrl.drawingMode = undefined;

		ctrl.strokeWidths = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		ctrl.strokeWidth = 1;

		ctrl.eraserWidths = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		ctrl.eraserWidth = 1;

		ctrl.colors = ['#000000', '#1f75fe', '#b4674d', '#1cac78', '#666', '#ff7538', '#ee204d', '#ff5349', '#80daeb', '#926eae', '#fce883', '#c5e384'];
		ctrl.selectedColor = undefined;

		ctrl.backgrounds = [
			{
				id: 1,
				description: 'Fundus',
				imageUrl: 'images/bg_fundus.png'
			},
			{
				id: 2,
				description: 'Macula',
				imageUrl: 'images/bg_macula.png'
			},
			{
				id: 3,
				description: 'Nerve',
				imageUrl: 'images/bg_nerve.png'
			}];

		ctrl.drawingBackground = undefined;

		// Initialize the canvas and set the default drawing color and background
		ctrl.$onInit = function () {
			initCanvas();

			setDrawingMode(DRAWING_MODES.FREE_DRAWING);
			setSelectedColor(ctrl.colors[0]);
			setEraserWidth(ctrl.eraserWidth);

			ctrl.drawingBackground = ctrl.backgrounds[0];
			renderBackground();
		};

		function initCanvas() {
			// Initialize the canvas
			canvas = new fabric.Canvas('drawing-canvas');

			// Set default color and stroke width
			canvas.freeDrawingBrush.color = ctrl.selectedColor;
			canvas.freeDrawingBrush.width = ctrl.strokeWidth;

			// Set default eraser width
			// canvas.eraserBrush.width = ctrl.eraserWidth;

			// Set options to allow multi-select using the shift or ctrl keys
			canvas.selectionKey = ['shiftKey', 'ctrlKey'];
		}

		function renderBackground() {
			if (!canvas)
				return;

			// Load the image from the URL specified and set canvas dimensions to match
			fabric.Image.fromURL(ctrl.drawingBackground.imageUrl, function (img) {
				canvas.backgroundImage = img;
				canvas.setDimensions({ width: img.width, height: img.height });
			});
		}

		function deleteObjects(objects) {
			if (!canvas)
				return;

			// Remove the specified objects from the canvas
			for (var i = 0, len = objects.length; i < len; i++) {
				canvas.remove(objects[i]);
			}
		}

		// Sets the drawing mode to either free drawing or select
		function setDrawingMode(val) {
			ctrl.drawingMode = val;

			if (!canvas)
				return;

			switch (val) {
				case DRAWING_MODES.FREE_DRAWING:
					canvas.isDrawingMode = true;
					break;
				case DRAWING_MODES.SELECT_PATH:
					canvas.isDrawingMode = false;
					break;
				case DRAWING_MODES.ERASING:
					canvas.isDrawingMode = true;
					canvas.isErasingMode = true;
			}
		}

		function setSelectedColor(val) {
			ctrl.selectedColor = val;

			if (canvas)
				canvas.freeDrawingBrush.color = ctrl.selectedColor;
		}

		function setStrokeWidth() {
			if (canvas)
				canvas.freeDrawingBrush.width = ctrl.strokeWidth;
		}
		
		function setEraser() {
			if (canvas)
			console.log(canvas);
			// insert freeDrawing but use:
			// ctx.globalCompositeOperation = 'destination-out';
			// canvas.eraserBrush = fabric.PencilBrush && new fabric.PencilBrush(ctrl);
			var context = canvas.getContext();
			// console.log(context.globalCompositeOperation);
			context.globalCompositeOperation = 'destination-out';
			console.log(context.globalCompositeOperation);
			canvas.freeDrawingBrush.width = ctrl.eraserWidth;
			canvas.freeDrawingBrush.color  = 'white';
			canvas.globalCompositeOperation = 'destination-out';
			// ctrl._setupCompositeOperation('destination-out');
				// canvas.eraserBrush.width = ctrl.eraserWidth;
		};

		function setEraserWidth() {
			if (canvas)
				canvas.freeDrawingBrush.width = ctrl.eraserWidth;
		};
		
	// 	canvas.onmouseover = function(e) {
	// 		if (!canvas.isDrawing) {
	// 			 return;
	// 		}
	// 		var x = e.pageX - this.offsetLeft;
	// 		var y = e.pageY - this.offsetTop;
	// 		var radius = 10; // or whatever
	// 		var fillColor = '#fafafa';
	// 		ctx.globalCompositeOperation = 'destination-out';
	// 		ctx.fillCircle(x, y, radius, fillColor);
	// };
	// canvas.node.onmousedown = function(e) {
	// 		canvas.isDrawing = true;
	// };
	// canvas.node.onmouseup = function(e) {
	// 		canvas.isDrawing = false;
	// };
		
		/******************************
		 *       Event Handlers       *
		 ******************************/

		ctrl.onColorClick = function (color) {
			setSelectedColor(color);
			setDrawingMode(DRAWING_MODES.FREE_DRAWING);
		};

		ctrl.onDrawingModeClick = function(drawingMode) {
			setDrawingMode(drawingMode);
		};

		ctrl.onBackgroundChange = function () {
			renderBackground();
		};

		ctrl.onStrokeWidthChanged = function() {
			setStrokeWidth();
		};

		ctrl.setEraser = function() {
			setEraser();
		};

		ctrl.onEraserWidthChanged = function() {
			setEraserWidth();
		};

		ctrl.onDeleteClick = function () {
			deleteObjects(canvas.getActiveObjects());
		};
	}
})();
