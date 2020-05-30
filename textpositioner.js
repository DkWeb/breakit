var singleLineTextPositioner = function() {
    return {
        calcLeftAlignX: function(text, canvasCtx, paddingLeftInPercentage) {
            var widthInPixel = canvasCtx.canvas.width;
            return  Math.floor(widthInPixel / 100 * paddingLeftInPercentage);
        },

        calcCenterX: function(text, canvasCtx) {
            var widthInPixel = canvasCtx.canvas.width;
            var textWidth = canvasCtx.measureText(text).width;
            return Math.floor((widthInPixel / 2) - (textWidth / 2));
        },

        calcRightAlignX: function(text, canvasCtx, paddingRightInPercentage) {
            var widthInPixel = canvasCtx.canvas.width;
            var textWidth = canvasCtx.measureText(text).width;            
            var paddingRightInPixel = Math.floor(widthInPixel / 100 * paddingRightInPercentage);
            return Math.floor(widthInPixel - textWidth - paddingRightInPixel);
        }        
    }
}();