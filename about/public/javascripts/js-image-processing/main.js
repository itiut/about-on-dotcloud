window.onload = function() {
  var filter = createFilter();
  var baseInit = function(id, effect) {
    var self = document.getElementById(id);
    var src = self.getElementsByTagName('img')[0];
    var dstWrapper = self.getElementsByClassName('dst-wrapper')[0];
    var canvas = document.createElement('canvas');

    effect = effect || id;
    filter[effect](canvas, src);
    dstWrapper.appendChild(canvas);
  };

  var inputInit = function(id, effect) {
    var self = document.getElementById(id);
    var src = self.getElementsByTagName('img')[0];
    var dstWrapper = self.getElementsByClassName('dst-wrapper')[0];
    var canvas = document.createElement('canvas');

    var control = self.getElementsByTagName('input')[0];
    var info = self.getElementsByTagName('label')[0].firstChild;
    info.innerText = control.name + ' = ' + control.value;

    effect = effect || id;
    filter[effect](canvas, src, Number(control.value));
    dstWrapper.appendChild(canvas);

    control.addEventListener('change', function(e) {
      info.innerText = this.name + ' = ' + this.value;
      filter[effect](canvas, src, Number(this.value));
    });
  };

  inputInit('grayscale-average', 'grayscaleAverage');
  inputInit('grayscale-ntsc', 'grayscaleNTSC');
  baseInit('halftone-dither', 'halftoneDither');
  baseInit('halftone-error-diffusion', 'halftoneErrorDiffusion');
  inputInit('gamma');
  baseInit('inverse');
  baseInit('solarize');
  baseInit('pseudo');
  inputInit('posterize');
  inputInit('average');
  inputInit('gaussian');
  inputInit('mosaic');
  baseInit('first-differential', 'firstDifferential');
  baseInit('prewitt');
  baseInit('sobel');
  baseInit('laplacian');
  inputInit('sharpen');
};