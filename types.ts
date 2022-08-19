declare type CustomOptions = {
  svgOptions?: any;
  fileLoaderOptions?: any;
  defineConstants?: any;
  ignorePluginOptions?: any;
  htmlWebpackPluginOptions?: any;
  miniCssExtractPluginOption?: any;
  customPlugins?: any;
};

declare type CustomPath = {
  dotenv?: string;
  appPath?: string;
  appBuild?: string;
  appPublic?: string;
  appHtml?: string;
  appIndexJs?: string;
  appPackageJson?: string;
  appSrc?: string;
  appTsConfig?: string;
  appJsConfig?: string;
  yarnLockFile?: string;
  proxySetup?: string;
  appNodeModules?: string;
  appWebpackCache?: string;
};
