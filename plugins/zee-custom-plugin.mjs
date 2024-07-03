'use strict';

import { pathElems } from '../node_modules/svgo/plugins/_collections.js';
import { querySelector } from '../node_modules/svgo/lib/xast.js';

import parse from 'parse-svg-path';
import scale from 'scale-svg-path';
import serialize from 'serialize-svg-path';

const name = 'zeeCustomPlugin';

const fn = (root, params) => {
  const {
    customSize = process.env.SIZE,
  } = params;
  
  const svgRoot = querySelector(root, 'svg');
  const { width, height, viewBox } = svgRoot.attributes;
  
  let origWidth, origHeight;
  
  if (viewBox) {
    [, , origWidth, origHeight] = viewBox.split(' ').map(Number);
  } else {
    origWidth = parseFloat(width);
    origHeight = parseFloat(height);
  }
  
  const aspectRatio = origWidth / origHeight;
  const targetHeight = customSize;
  const targetWidth = customSize * aspectRatio;
  
  const scaleFactorX = targetWidth / origWidth;
  const scaleFactorY = targetHeight / origHeight;
  
  return {
    element: {
      enter: (node, parentNode) => {
        if (node.name === 'svg' && parentNode.type === 'root') {
          node.attributes.viewBox = `0 0 ${targetWidth} ${targetHeight}`;
          delete node.attributes.width;
          delete node.attributes.height;
        }
        if (pathElems.has(node.name) && node.attributes.d != null) {
          if (
            (node.attributes.fill === undefined || node.attributes.fill == null) &&
            (node.attributes.stroke === undefined || node.attributes.stroke == null)
          ) {
            node.attributes.fill = 'currentColor';
          }

          const parsedD = parse(node.attributes.d);
          const scaledD = scale(parsedD, scaleFactorX, scaleFactorY);
          node.attributes.d = serialize(scaledD);

        }
      },
    },
  };
};

export default {
	fn,
	name
};
