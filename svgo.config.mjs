import convertShapesToPath from './plugins/convert-shapes-to-path.mjs';
import removeEmptyPath from './plugins/remove-empty-path.mjs';
import removeUnwantedAttrs from './plugins/remove-unwanted-attrs.mjs';
import zeeCustomPlugin from './plugins/zee-custom-plugin.mjs';

export default {
  multipass: false,
  js2svg: { pretty: true, indent: 2, finalNewline: true, },
  plugins: [
    convertShapesToPath,
    {
      name: 'preset-default',
      overrides: {
          removeViewBox: false,
          convertShapeToPath: false,
          moveElemsAttrsToGroup: false,
      },
    },
    {
      name: 'removeComments',
      params: {
        preservePatterns: false,
      },
    },
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: 'svg',
        attributes: ['xml:space', 'id', 'baseProfile'],
      },
    },
    {
      name: 'convertStyleToAttrs',
      params: {
        keepImportant: false,
      },
    },
    {
      name: 'sortAttrs',
    },
    {
      name: 'collapseGroups',
    },
    {
      name: 'convertPathData',
    },
    removeEmptyPath,
    removeUnwantedAttrs,
    zeeCustomPlugin,
  ],
}