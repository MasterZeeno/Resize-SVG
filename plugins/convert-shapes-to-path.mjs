'use strict';

import { elems, elemsGroups } from '../node_modules/svgo/plugins/_collections.js';
import toPath from 'element-to-path';

const name = 'convertShapesToPath';

const makeArray = (arr) => {
  return Array.isArray(arr) ? arr : [arr];
};

const fn = () => {
  return {
    element: {
      enter: (node) => {
          if (elemsGroups.shape.has(node.name)) {
           
            const shapeToPathData = toPath(node);
            const attrs = makeArray(elems[node.name].attrs);
            
            if (attrs) {
              for (const attr in attrs) {
                if(node.attributes[attr]) {
                  delete node.attributes[attr];
                }
              }
            }
            
            node.name = 'path';
            node.attributes.d = shapeToPathData;
          }
      },
    },
  };
};

export default {
	fn,
	name
};
