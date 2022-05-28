/*
colorvibrance.js - a JS library for colorizing black-background overlays

Written by yikuansun (https://github.com/yikuansun)
*/

function colorvibrance(ctx, color="#FF8000", vibrance=1) {
    ctx.save();

    var HSLtoRGB = function(h, s, l) {
        var a = s * Math.min(l, 1 - l);
        var f = (n, k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1), -1);
        return [f(0), f(8), f(4)];
    }
    var RGBtoHSL = function(r, g, b) {
        var v = Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1)); 
        var h = c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
        return [60*(h<0?h+6:h), f ? c/f : 0, (v+v-c)/2];
    }

    // save original image
    var OGimageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    // use fill layers with blend modes to get color map
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = "color";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = vibrance;
    ctx.fillRect(0, 0, canv.width, canv.height);
    var colormap = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    // blend original image and color map
    var ogdata = OGimageData.data;
    var cmapdata = colormap.data;
    for (var i = 0; i < ogdata.length; i += 4) {
        var pixel_color = RGBtoHSL(cmapdata[i + 0], cmapdata[i + 1], cmapdata[i + 2]);
        // set luminosity to be same as that of original pixel
        pixel_color[2] = RGBtoHSL(ogdata[i + 0], ogdata[i + 1], ogdata[i + 2])[2];
        var pixel_color_rgb = HSLtoRGB(pixel_color[0], pixel_color[1], pixel_color[2]);
        for (var j = 0; j < 3; j++) {
            ogdata[i + j] = pixel_color_rgb[j];
        }
    }
    ctx.putImageData(OGimageData, 0, 0);

    ctx.restore();
}