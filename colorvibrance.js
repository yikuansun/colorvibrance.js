/*
colorvibrance.js - a JS library for colorizing black-background overlays

Written by yikuansun (https://github.com/yikuansun)
*/

function colorvibrance(ctx, hue=200, saturation=100) {
    ctx.save();

    // get color map
    ctx.fillStyle = `hsl(${hue}deg, ${saturation}%, ${50 - saturation / 4}%)`;
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.restore();
}