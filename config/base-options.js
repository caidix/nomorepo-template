const emptyObj = {};

const emptySouceObj = {
  parser: {},
  generator: {},
};

const enableFalseObj = {
  enable: false,
  config: {},
};

const enableTrueObj = {
  enable: true,
  config: {},
};

const enableGlobalVarFalseObj = {
  enable: false,
  scssConfig: {},
  lessConfig: {},
};

module.exports = {
  alias: emptyObj,
  entry: emptyObj,
  output: emptyObj,
  sourceRoot: 'src',
  outputRoot: 'dist',
  publicRoot: 'public',
  chunkDirectory: 'chunk',
  publicPath: '',
  staticDirectory: 'static',
  enableSourceMap: true,
  env: emptyObj,
  defineConstants: emptyObj,

  styleLoaderOption: emptyObj,
  miniCssExtractOption: emptyObj,
  cssLoaderOption: emptyObj,
  lessLoaderOptions: emptyObj,
  sassLoaderOptions: emptyObj,
  resourcesLoaderOptions: enableGlobalVarFalseObj,
  typingsCssModuleLoaderOption: enableFalseObj,

  mediaLoaderOption: emptySouceObj,
  fontLoaderOption: emptySouceObj,
  imageLoaderOption: emptySouceObj,
  imageCompressLoaderOptions: enableFalseObj,

  babelIncludePackage: [],
  babelLoaderOption: emptyObj,
  threadLoaderOption: emptyObj,
  esbuildLoaderOption: {
    enable: false,
    loaderConfig: {
      loader: 'tsx',
      target: 'es2015',
    },
    miniConfig: {
      target: 'es2015',
      css: true,
    },
  },

  cacheOptions: enableTrueObj,

  friendlyErrorsPluginOption: emptyObj,
  miniCssExtractPluginOption: emptyObj,
  yunkeSettingPluginOption: {
    deployType: 'docker',
  },
  bundleAnalyzerPluginOption: enableFalseObj,
  fastOpenPluginOption: enableFalseObj,
  copyPluginOptions: emptyObj,
  reactAutoRoutePluginOption: {
    config: emptyObj,
    root: 'src/pages',
  },
};
