'use strict';

import { attrsGroups } from '../node_modules/svgo/plugins/_collections.js';

const name = 'removeUnwantedAttrs';

const unwantedAttrs = ['data-', 'data', '-rendering', '-rule'];

const fn = () => {
  return {
    element: {
      enter: (node) => {
        for (const [name, value] of Object.entries(node.attributes)) {
          if (
            (value === '' && !attrsGroups.conditionalProcessing.has(name)) ||
            unwantedAttrs.some(attr => name.includes(attr))
          ) {
            delete node.attributes[name];
          }
        }
      },
    },
  };
};

export default {
	fn,
	name
};
