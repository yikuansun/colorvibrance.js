function colorvibrance(ctx, color="#FF8000", vibrance=1) {
    // conversions thanks to https://stackoverflow.com/a/17243070
    var HSVtoRGB = function(h, s, v) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }
    var RGBtoHSV = function(r, g, b) {
        var max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;
        switch (max) {
            case min: h = 0; break;
            case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
            case g: h = (b - r) + d * 2; h /= 6 * d; break;
            case b: h = (r - g) + d * 4; h /= 6 * d; break;
        }
        return [h, s, v];
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
        var pixel_color = RGBtoHSV(cmapdata[i + 0], cmapdata[i + 1], cmapdata[i + 2]);
        // set brightness (value) to be same as that of original pixel
        pixel_color[2] = RGBtoHSV(ogdata[i + 0], ogdata[i + 1], ogdata[i + 2])[2];
        var pixel_color_rgb = HSVtoRGB(pixel_color[0], pixel_color[1], pixel_color[2]);
        for (var j = 0; j < 3; j++) {
            ogdata[i + j] = pixel_color_rgb[j];
        }
    }
    ctx.putImageData(OGimageData, 0, 0);
}