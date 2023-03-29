const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const getBaseLoader = require("./base-loaders.conf");
const getBasePlugins = require("./base-plugins.conf");

/** 默认开启source-map */
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

module.exports = function (paths, env, options = {}) {
  const webpackEnv = options.mode || process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const { output, alias, chunkDirectory, cacheOptions } = options;

  const rules = getBaseLoader(webpackEnv, paths, env, options);
  const plugins = getBasePlugins(webpackEnv, paths, env, options);

  const minimizer = [
    // This is only used in production mode
    new TerserPlugin({
      terserOptions: {
        parse: {
          // We want terser to parse ecma 8 code. However, we don't want it
          // to apply any minification steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8,
        },
        compress: {
          drop_console: true,
          drop_debugger: true,
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending further investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        keep_fnames: true,
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
          keep_quoted_props: true,
          quote_keys: true,
          beautify: false,
        },
      },
    }),
    // This is only used in production mode
    new CssMinimizerPlugin(),
  ];
  console.log({
    __filename,
    starts: path.join(__dirname, "../scripts/start.js"),
  });
  return {
    target: ["browserslist"],
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
      filename: "js/[name].[chunkhash].js",
      chunkFilename: `${chunkDirectory}/[name].[chunkhash].js`,
      publicPath: paths.publicUrlOrPath,
      /** 将sourcemap条目指向原始磁盘位置（在Windows上格式化为URL） */
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment &&
          ((info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
      ...output,
    },
    /** 在第一个错误出现时抛出失败结果，而不是容忍它。默认情况下，当使用 HMR 时，webpack 会将在终端以及浏览器控制台中，以红色文字记录这些错误，但仍然继续进行打包 */
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",

    /** cache 是编译开发里一个非常重要的选项，如果不开启每次热更新的速度都会很慢 */
    cache: cacheOptions.enable
      ? {
          type: "filesystem",
          name: isEnvProduction ? "production-cache" : "dev-cache",
          cacheDirectory: paths.appWebpackCache,
          store: "pack", // 当编译器闲置时候，将缓存数据都存放在一个文件中
          version: webpackEnv, // 避免修改mode参数之后缓存不失效导致构建失败
          buildDependencies: {
            config: [
              __filename,
              paths.appConfig,
              path.join(__dirname, "../scripts/start.js"),
            ],
            tsconfig: [paths.appTsConfig, paths.appJsConfig].filter((f) =>
              fs.existsSync(f)
            ),
          },
          ...cacheOptions.config,
        }
      : false,
    optimization: {
      minimize: isEnvProduction,
      minimizer,
      splitChunks: {
        chunks: "all",
        minSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: "~",
        cacheGroups: {
          react: {
            test: /[\\\/]node_modules[\\\/](core-js|react|react-dom|redux|react-redux|props-type|redux-thunk|immer|history|@reduxjs\/toolkit|react-router|react-router-dom)[\\\/]/,
            priority: 0,
            reuseExistingChunk: true,
            name: "react",
          },
          verndor: {
            test: /[\\\/]node_modules[\\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name: "verndor",
          },
          common: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name: "common",
          },
        },
      },
      runtimeChunk: {
        name: "runtime",
      },
      emitOnErrors: true,
    },
    resolve: {
      alias: {
        "@src": path.resolve(paths.appPath, "src"),
        ...alias,
      },
      modules: [
        "node_modules",
        path.join(process.cwd(), "node_modules"),
        path.join(__dirname, "../../node_modules"),
      ],
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      mainFields: ["browser", "main:h5", "module", "main"],
      symlinks: true,
    },
    module: {
      rules,
    },
    plugins,
  };
};
