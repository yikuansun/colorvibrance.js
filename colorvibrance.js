/*
colorvibrance.js - a JS library for colorizing black-background overlays

Written by yikuansun (https://github.com/yikuansun)
*/

function colorvibrance(ctx, color="#FF8000", vibrance=100) {
    ctx.save();

    var HSLtoRGB = function(h, s, l) {
        var a = s * Math.min(l, 1 - l);
        var f = (n, k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1), -1);
        return [f(0) * 255, f(8) * 255, f(4) * 255];
    }
    var RGBtoHSL = function(r, g, b) {
        var r = r / 255, g = g / 255, b = b / 255;
        var v = Math.max(r,g,b), c=v-Math.min(r,g,b), f=(1-Math.abs(v+v-c-1)); 
        var h = c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
        return [60*(h<0?h+6:h), f ? c/f : 0, (v+v-c)/2];
    }

    // get color map
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = "color";
    ctx.fillRect(0, 0, canv.width, canv.height);
    var colormap = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var OGcolorData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    // boost vibrance
    var cmapdata = colormap.data;
    for (var i = 0; i < cmapdata.length; i += 4) {
        var rgb = [cmapdata[i], cmapdata[i + 1], cmapdata[i + 2]];
        var maxchannel = rgb.indexOf(Math.max.apply(null, rgb));
        var minchannel = rgb.indexOf(Math.min.apply(null, rgb));
        cmapdata[i + maxchannel] = Math.min(cmapdata[i + maxchannel] + vibrance, 255);
        cmapdata[i + minchannel] = Math.max(cmapdata[i + minchannel] - vibrance, 0);
    }
    
    // blend original image and color map
    var ogdata = OGcolorData.data;
    for (var i = 0; i < ogdata.length; i += 4) {
        var pixel_color = RGBtoHSL(ogdata[i + 0], ogdata[i + 1], ogdata[i + 2]);
        // shift hue using color map
        pixel_color[0] = RGBtoHSL(cmapdata[i + 0], cmapdata[i + 1], cmapdata[i + 2])[0];
        var pixel_color_rgb = HSLtoRGB(pixel_color[0], pixel_color[1], pixel_color[2]);
        for (var j = 0; j < 3; j++) {
            ogdata[i + j] = pixel_color_rgb[j];
        }
    }
    
    ctx.putImageData(OGcolorData, 0, 0);

    ctx.restore();
}