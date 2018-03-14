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
			SELECT_PATH: 'selectPath'
		};

		var ctrl = this;

		var canvas = undefined;

		ctrl.DRAWING_MODES = DRAWING_MODES;

		ctrl.drawingMode = undefined;

		ctrl.strokeWidths = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		ctrl.strokeWidth = 1;

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

			ctrl.drawingBackground = ctrl.backgrounds[0];
			renderBackground();
		};

		function initCanvas() {
			// Initialize the canvas
			canvas = new fabric.Canvas('drawing-canvas');

			// Set default color and stroke width
			canvas.freeDrawingBrush.color = ctrl.selectedColor;
			canvas.freeDrawingBrush.width = ctrl.strokeWidth;

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

		ctrl.onDeleteClick = function () {
			deleteObjects(canvas.getActiveObjects());
		};
	}
})();
