
/*
 * GET home page.
 */

exports.main = function(req, res){
  var params = {
    title: 'Javascript Image Processing',
    imageDir: 'alegriphotos/',
    items: [
      {
        id:    'grayscale-average',
        title: 'Straight Average Grayscale',
        src:   'summer-nectarine-and-tomato.jpg',
        input: {
          name: 'bit', value: 4, min: 1, max: 8, step: 1
        }
      },
      {
        id:    'grayscale-ntsc',
        title: 'NTSC Weighted Average Grayscale',
        src:   'summer-nectarine-and-tomato.jpg',
        input: {
          name: 'bit', value: 4, min: 1, max: 8, step: 1
        }
      },
      {
        id:    'halftone-dither',
        title: 'Dither Halftone',
        src:   'domestic-cat.jpg',
        input: null
      },
      {
        id:    'halftone-error-diffusion',
        title: 'Error Diffution Halftone',
        src:   'domestic-cat.jpg',
        input: null
      },
      {
        id:    'gamma',
        title: 'Gamma Correction',
        src:   'dog-walking-in-the-park.jpg',
        input: {
          name: 'gamma', value: 1.0, min: 0.2, max: 3.0, step: 0.2
        }
      },
      {
        id:    'inverse',
        title: 'Invert Colors',
        src:   'red-garden-tulips.jpg',
        input: null
      },
      {
        id:    'solarize',
        title: 'Solarization',
        src:   'marguerite-wild-flower.jpg',
        input: null
      },
      {
        id:    'pseudo',
        title: 'Pseudo Color',
        src:   'traffic-sign-next-to-modern-building_mono.jpg',
        input: null
      },
      {
        id:    'posterize',
        title: 'Posterization',
        src:   'single-pink-flower.jpg',
        input: {
          name: 'bit', value: 4, min: 1, max: 8, step: 1
        }
      },
      {
        id:    'average',
        title: 'Average Filter',
        src:   'art-supplies.jpg',
        input: {
          name: 'size', value: 3, min: 3, max: 9, step: 2
        }
      },
      {
        id:    'gaussian',
        title: 'Gaussian Filter',
        src:   'art-supplies.jpg',
        input: {
          name: 'sigma', value: 0.5, min: 0.5, max: 3, step: 0.5
        }
      },
      {
        id:    'mosaic',
        title: 'Mosaic',
        src:   'pliers.jpg',
        input: {
          name: 'size', value: 2, min: 2, max: 16, step: 2
        }
      },
      {
        id:    'first-differential',
        title: 'First Order Differential Filter',
        src:   'mirror-and-tweezers.jpg',
        input: null
      },
      {
        id:    'prewitt',
        title: 'Prewitt Filter',
        src:   'mirror-and-tweezers.jpg',
        input: null
      },
      {
        id:    'sobel',
        title: 'Sobel Filter',
        src:   'mirror-and-tweezers.jpg',
        input: null
      },
      {
        id:    'laplacian',
        title: 'Laplacian Filter',
        src:   'mirror-and-tweezers.jpg',
        input: null
      },
      {
        id:    'sharpen',
        title: 'Sharpening Filter',
        src:   'pink-marguerite.jpg',
        input: {
          name: 'degree', value: 1, min: 0.2, max: 2, step: 0.2
        }
      }
    ]
  };

  res.render('js-image-processing', params);
};