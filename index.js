(function(root, factory) {
  "use strict";
  if (typeof exports === "object") {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function() {
      return factory();
    });
  } else if (typeof define === "function" && define.cmd) {
    // CMD
    define(function(require, exports, module) {
      module.exports = factory();
    });
  } else {
    // Global Variables
    root.ResizeImage = factory();
  }
})(this, function() {
  "use strict";
  var out = {};

  var IMG_TYPE_PNG = "png";
  var IMG_TYPE = [IMG_TYPE_PNG, "gif", "bmp", "jpeg", "webp"];

  for (var i = 0; i < IMG_TYPE.length; i++) {
    out[IMG_TYPE[i].toUpperCase()] = IMG_TYPE[i];
  }

  function adjustOrientation(ctx, width, height, orientation) {
    if (!orientation) {
      return;
    }
    switch (orientation) {
      case 1:
        ctx.transform(1, 0, 0, 1, 0, 0);
        break;
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        return;
    }
    //return ctx;
  }

  /**
   * resize an <img> or <canvas> to canvas
   * @param  {Image}  img    an <img> or Image() or <canvas>
   * @param  {number} width  output image width
   * @param  {number} height output image height
   * @return {Canvas}        output image canvas
   */
  function resize2Canvas(img, width, height, orientation) {
    if (!img || !width) {
      return img;
    }
    //height = height || width;
    // 按原图缩放
    // var detImg = img.width / img.height;
    // if (width / height > detImg) {
    //   height = width / detImg;
    // } else {
    //   width = height * detImg;
    // }
    // 画到 canvas 中
    var canvas = document.createElement("canvas");
    if (orientation) {
      if (orientation > 4 && orientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
    } else {
      canvas.width = width;
      canvas.height = height;
    }
    // canvas.width = width;
    // canvas.height = height;
    var ctx = canvas.getContext("2d");
    switch (orientation) {
      case 1:
        ctx.transform(1, 0, 0, 1, 0, 0);
        break;
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        console.log("rotating convas");
        ctx.transform(0, 1, -1, 0, height, 0);
        //ctx.rotate(Math.PI / 180 * 90);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
    }
    // adjustOrientation(ctx, width, height, orientation);
    if (orientation) {
      console.log("drawing image after orientation");
      ctx.drawImage(img, 0, 0);
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }

    return canvas;
  }
  out.resize2Canvas = resize2Canvas;

  /**
   * resize an <img> or <canvas> to base64
   * @param  {Image}  img    an <img> or Image() or <canvas
   * @param  {number} width  output image width
   * @param  {number} height output image height
   * @param  {string} type   output image type
   * @return {string}        output image base64 string
   */
  out.resize = function resize(img, width, height, type, orientation) {
    if (IMG_TYPE.indexOf(type) < 0) {
      type = IMG_TYPE_PNG;
    }
    var canvas = resize2Canvas(img, width, height, orientation);
    var ctx = canvas.getContext("2d");
    // set backgrund color to #fff while output type is NOT PNG
    if (type !== IMG_TYPE_PNG) {
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "";
    }
    //return canvas.toDataURL("image/" + type);
    return canvas.toDataURL();
  };

  return out;
});
