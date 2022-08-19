'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function getLocalIdent(context, localIdentName, localName, options) {
  // 优化下index.module.css or index.module.less的类名，使用目录名
  const fileNameOrFolder = context.resourcePath.match(/index\.module\.(css|scss|sass|less)$/)
    ? '[folder]'
    : '[name]';
    // 创建一个唯一的hash
  const hash = loaderUtils.getHashDigest(
    path.posix.relative(context.rootContext, context.resourcePath) + localName,
    'md5',
    'base64',
    5,
  );
  // 输出新的类名，即将"/absolute/path/to/app/js/javascript.js"通过占位符改写`[name || folder]_${localName}__${hash}`
  const className = loaderUtils.interpolateName(
    context,
    `${fileNameOrFolder }_${ localName }__${ hash}`,
    options,
  );
  // 将上一步生成的class类名中的.module_替换成_
  return className.replace('.module_', '_');
};
