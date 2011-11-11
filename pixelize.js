/* Pixelize
 * 
 * Developed by Joshua Johanan
 * 
 * Thanks to Close Pixelate for some inspiration
 * 
 */

var pixelate = {};

pixelate.proxyCanvas = document.createElement('canvas');

// checking for canvas support
pixelate.supportsCanvas = !!pixelate.proxyCanvas.getContext &&
  !!pixelate.proxyCanvas.getContext('2d');

if(pixelate.supportsCanvas){ 
	HTMLImageElement.prototype.pixelize = function (scaleFactor){
		pixelate.imgPixelize(this, scaleFactor);
	}
}
	   
pixelate.imgPixelize = function(image, scaleFactor)
	{
		var pixelize = function(){
			if(!scaleFactor)
			{
				//determine larger side
				var largerSide = (image.height > image.width) ? image.height : image.width;
				//calculate a scale ratio to match the size with a floor at .35
				scaleFactor = (largerSide > 150) ? 50/largerSide : .35;
			}
				//first canvas to scale down
			 	var newCanvas = document.createElement('canvas');
				newCanvas.height = image.height*scaleFactor;
				newCanvas.width = image.width*scaleFactor;
				
				//add image to the first canvas
				var context = newCanvas.getContext('2d');
				context.drawImage(image, 0,0,image.width*scaleFactor, image.height*scaleFactor );
				
				
				//next canvas to scale up
				var nextCanvas = document.createElement('canvas');
				nextCanvas.height = image.height;
				nextCanvas.width = image.width;
				
				//use previous canvas as sourcea
				var newCtx = nextCanvas.getContext('2d');
				newCtx.drawImage(newCanvas, 0,0, image.width, image.height);
				
				delete newCanvas;
				image.parentNode.replaceChild(nextCanvas, image);
			}
			
			//wait for the image to load then pixelize it
			image.addEventListener( 'load', pixelize, false );	
	}