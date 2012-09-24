function createFilter() {
  var filter = {};

  // base filter function
  var filterit = function(canvas, src, fun) {
    var sw = canvas.width = src.width;
    var sh = canvas.height = src.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(src, 0, 0);

    var imageData = ctx.getImageData(0, 0, sw, sh);
    var data = imageData.data;

    for (var y = 0; y < sh; y++) {
      for (var x = 0; x < sw; x++) {
        var i = (y*sw + x) << 2;
        var c = fun(data[i], data[i+1], data[i+2]);
        data[i]   = c[0];
        data[i+1] = c[1];
        data[i+2] = c[2];
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // spatial filter function
  var spatialFilterit = function(canvas, src, matrix, weighted) {
    var ctx = canvas.getContext('2d');
    if (src) {
      canvas.width = src.width;
      canvas.height = src.height;
      ctx.drawImage(src, 0, 0); // use orignal alpha
    }
    var sw = canvas.width;
    var sh = canvas.height;
    var imageData = ctx.getImageData(0, 0, sw, sh);
    var data = imageData.data;

    // temporary canvas
    var canvas2 = document.createElement('canvas');
    canvas2.width = sw;
    canvas2.height = sh;

    var ctx2 = canvas2.getContext('2d');
    if (src) {
      ctx2.drawImage(src, 0, 0);
    } else {
      ctx2.putImageData(imageData, 0, 0);
    }

    var imageData2 = ctx2.getImageData(0, 0, sw, sh);
    var data2 = imageData2.data;

    var sizeY = (matrix.length - 1) / 2;
    var sizeX = (matrix[0].length - 1) / 2;
    for (var y = 0; y < sh; y++) {
      for (var x = 0; x < sw; x++) {
        var index = (y*sw + x) << 2;
        var c = [0, 0, 0];
        var weight = 0;

        for (var dy = -sizeY; dy <= sizeY; dy++) {
          for (var dx = -sizeX; dx <= sizeX; dx++) {
            if (y+dy < 0 || sh <= y+dy || x+dx < 0 || sw <= x+dx) {
              continue;
            }
            var i = ((y+dy)*sw + x+dx) << 2;
            c[0] += matrix[dy+sizeY][dx+sizeX] * data2[i];
            c[1] += matrix[dy+sizeY][dx+sizeX] * data2[i+1];
            c[2] += matrix[dy+sizeY][dx+sizeX] * data2[i+2];
            weight += matrix[dy+sizeY][dx+sizeX];
          }
        }

        if (weighted) {
          c[0] /= weight;
          c[1] /= weight;
          c[2] /= weight;
        }

        data[index]   = (c[0] < 0) ? 0 : (c[0] > 255) ? 255 : c[0];
        data[index+1] = (c[1] < 0) ? 0 : (c[1] > 255) ? 255 : c[1];
        data[index+2] = (c[2] < 0) ? 0 : (c[2] > 255) ? 255 : c[2];
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // edge filter function
  var edgeFilterit = function(canvas, src, matrixX, matrixY) {
    var sw = canvas.width = src.width;
    var sh = canvas.height = src.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(src, 0, 0);

    var imageData = ctx.getImageData(0, 0, sw, sh);
    var data = imageData.data;

    // temporary canvas
    var canvas2 = document.createElement('canvas');
    canvas2.width = sw;
    canvas2.height = sh;

    var ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(src, 0, 0);

    var imageData2 = ctx2.getImageData(0, 0, sw, sh);
    var data2 = imageData2.data;

    for (var y = 0; y < sh; y++) {
      for (var x = 0; x < sw; x++) {
        var index = (y*sw + x) << 2;
        var cx = [0, 0, 0];
        var cy = [0, 0, 0];

        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            if (y+dy < 0 || sh <= y+dy || x+dx < 0 || sw <= x+dx) {
              continue;
            }
            var i = ((y+dy)*sw + x+dx) << 2;
            cx[0] += matrixX[dy+1][dx+1] * data2[i];
            cx[1] += matrixX[dy+1][dx+1] * data2[i+1];
            cx[2] += matrixX[dy+1][dx+1] * data2[i+2];
            cy[0] += matrixY[dy+1][dx+1] * data2[i];
            cy[1] += matrixY[dy+1][dx+1] * data2[i+1];
            cy[2] += matrixY[dy+1][dx+1] * data2[i+2];
          }
        }

        var c = [
          Math.sqrt(cx[0]*cx[0] + cy[0]*cy[0]),
          Math.sqrt(cx[1]*cx[1] + cy[1]*cy[1]),
          Math.sqrt(cx[2]*cx[2] + cy[2]*cy[2])
        ];

        data[index]   = (c[0] < 0) ? 0 : (c[0] > 255) ? 255 : c[0];
        data[index+1] = (c[1] < 0) ? 0 : (c[1] > 255) ? 255 : c[1];
        data[index+2] = (c[2] < 0) ? 0 : (c[2] > 255) ? 255 : c[2];
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };


  filter.grayscaleAverage = function(canvas, src, bit) {
    var level = 256 / (Math.pow(2, bit) - 1);
    var t = new Array(256);
    for (var i = 0; i < 256; i++) {
      t[i] = Math.round(i / level) * level;
    }

    filterit(canvas, src, function(r, g, b) {
      var c = (r + g + b) / 3;
      c = t[Math.round(c)];
      return [c, c, c];
    });
  };

  filter.grayscaleNTSC = function(canvas, src, bit) {
    var level = 256 / (Math.pow(2, bit) - 1);
    var t = new Array(256);
    for (var i = 0; i < 256; i++) {
      t[i] = Math.round(i / level) * level;
    }

    filterit(canvas, src, function(r, g, b) {
      var c = 0.298912 * r + 0.586611 * g + 0.114478 * b;
      c = t[Math.round(c)];
      return [c, c, c];
    });
  };

  filter.halftoneDither = function(canvas, src) {
    filter.grayscaleNTSC(canvas, src, 8);

    var sw = src.width;
    var sh = src.height;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, sw, sh);
    var data = imageData.data;

    var ditherTable = [
      8,   136, 40,  168,
      200, 72,  232, 104,
      56,  184, 24,  152,
      248, 120, 216, 88
    ];

    for (var y = 0; y < sh; y += 4) {
      for (var x = 0; x < sw; x += 4) {
        for (var dy = 0, dyEnd = Math.min(4, sh-y); dy < dyEnd; dy++) {
          for (var dx = 0, dxEnd = Math.min(4, sw-x); dx < dxEnd; dx++) {
            var i = ((y+dy)*sw + (x+dx)) << 2;
            if (data[i] >= ditherTable[dy*4 + dx]) {
              data[i] = data[i+1] = data[i+2] = 255;
            } else {
              data[i] = data[i+1] = data[i+2] = 0;
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  filter.halftoneErrorDiffusion = function(canvas, src) {
    filter.grayscaleNTSC(canvas, src, 8);

    var sw = src.width;
    var sh = src.height;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, sw, sh);
    var data = imageData.data;

    for (var y = 0; y < sh; y++) {
      for (var x = 0; x < sw; x++) {
        var i = (y*sw + x) << 2;
        var e;
        if (data[i] > 127) {
          e = data[i] - 255;
          data[i] = data[i+1] = data[i+2] = 255;
        } else {
          e = data[i];
          data[i] = data[i+1] = data[i+2] = 0;
        }

        var e1 = (e * 5) >> 4;
        var e2 = (e * 3) >> 4;

        i += 4;
        if (x < sw - 1) {
          data[i] = data[i+1] = data[i+2] = data[i] + e1;
        }

        if (y == sh - 1) {
          continue;
        }
        i += (sw - 2) << 2;
        data[i] = data[i+1] = data[i+2] = data[i] + e2;

        i += 4;
        data[i] = data[i+1] = data[i+2] = data[i] + e1;

        i += 4;
        if (x < sw - 1) {
          data[i] = data[i+1] = data[i+2] = data[i] + e2;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  filter.gamma = function(canvas, src, gamma) {
    var e = 1 / gamma;
    var t = new Array(256);
    for (var i = 0; i < 256; i++) {
      t[i] = 255 * Math.pow(i / 255, e);
    }

    filterit(canvas, src, function(r, g, b) {
      r = t[r];
      g = t[g];
      b = t[b];
      return [r, g, b];
    });
  };

  filter.inverse = function(canvas, src) {
    filterit(canvas, src, function(r, g, b) {
      return [255-r, 255-g, 255-b];
    });
  };

  filter.solarize = function(canvas, src) {
    var t = new Array(256);
    for (var i = 0; i < 86; i++) {
      t[i] = t[170-i] = t[170+i] = 3 * i;
    }

    filterit(canvas, src, function(r, g, b) {
      return [t[r], t[g], t[b]];
    });
  };

  filter.pseudo = function(canvas, src) {
    var t = new Array(256);
    for (var i = 0; i < 128; i++) {
      var r = 0;
      var g = Math.min(4*i, 255);
      var b = Math.min(510 - 4*i, 255);
      t[i] = [r, g, b];
      t[255-i] = [b, g, r];
    }

    filterit(canvas, src, function(r, g, b) {
      return t[r];
    });
  };

  filter.posterize = function(canvas, src, bit) {
    var level = 256 / (Math.pow(2, bit) - 1);
    var t = new Array(256);
    for (var i = 0; i < 256; i++) {
      t[i] = Math.round(i / level) * level;
    }

    filterit(canvas, src, function(r, g, b) {
      return [t[r], t[g], t[b]];
    });
  };

  filter.average = function(canvas, src, size) {
    var xm = [];
    xm[0] = new Array(size);
    for (var i = 0; i < size; i++) {
      xm[0][i] = 1;
    }
    var ym = new Array(size);
    for (var i = 0; i < size; i++) {
      ym[i] = [1];
    }

    spatialFilterit(canvas, src, xm, true);
    spatialFilterit(canvas, null, ym, true);
  };

  filter.gaussian = function(canvas, src, sigma) {
    var range = Math.floor(3 * sigma);
    var size = 2 * range + 1;

    var xm = [];
    xm[0] = new Array(size);
    for (var dx = -range; dx <= range; dx++) {
      xm[0][dx+range] = 1 / (Math.sqrt(2 * Math.PI) * sigma) * Math.exp(- dx*dx / (2*sigma*sigma));
    }
    var ym = new Array(size);
    for (var dy = -range; dy <= range; dy++) {
      ym[dy+range] = [xm[0][dy+range]];
    }

    spatialFilterit(canvas, src, xm, true);
    spatialFilterit(canvas, null, ym, true);
  };

  filter.mosaic = function(canvas, src, size) {
    var sw = canvas.width = src.width;
    var sh = canvas.height = src.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(src, 0, 0);

    var imageData = ctx.getImageData(0, 0, sw, sh);
    var data = imageData.data;

    for (var y = 0; y < sh; y += size) {
      for (var x = 0; x < sw; x += size) {
        var c = [0, 0, 0];
        var counter = 0;

        var dyEnd = Math.min(size, sh - y);
        var dxEnd = Math.min(size, sw - x);
        for (var dy = 0; dy < dyEnd; dy++) {
          for (var dx = 0; dx < dxEnd; dx++) {
            var i = ((y+dy)*sw + x+dx) << 2;
            c[0] += data[i];
            c[1] += data[i+1];
            c[2] += data[i+2];
            counter++;
          }
        }

        c[0] /= counter;
        c[1] /= counter;
        c[2] /= counter;

        for (var dy = 0; dy < dyEnd; dy++) {
          for (var dx = 0; dx < dxEnd; dx++) {
            var i = ((y+dy)*sw + x+dx) << 2;
            data[i]   = c[0];
            data[i+1] = c[1];
            data[i+2] = c[2];
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  filter.firstDifferential = function(canvas, src) {
    var mx = [
      [0, 0, 0],
      [0, -3, 3],
      [0, 0, 0]
    ];
    var my = [
      [0, 3, 0],
      [0, -3, 0],
      [0, 0, 0]
    ];

    edgeFilterit(canvas, src, mx, my);
  };
  filter.prewitt = function(canvas, src) {
    var mx = [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1]
    ];
    var my = [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1]
    ];

    edgeFilterit(canvas, src, mx, my);
  };

  filter.sobel = function(canvas, src) {
    var mx = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    var my = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ];

    edgeFilterit(canvas, src, mx, my);
  };

  filter.laplacian = function(canvas, src) {
    var m = [
      [0, 3, 0],
      [3, -12, 3],
      [0, 3, 0]
    ];

    spatialFilterit(canvas, src, m, false);
  };

  filter.sharpen = function(canvas, src, degree) {
    var m = [
      [-degree, -degree,    -degree],
      [-degree, 1+8*degree, -degree],
      [-degree, -degree,    -degree]
    ];

    spatialFilterit(canvas, src, m, false);
  };



  return filter;
}