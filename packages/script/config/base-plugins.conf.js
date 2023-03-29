const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const webpack = require("webpack");
const InterpolateHtmlPlugin = require("../utils/InterpolateHtmlPlugin");

module.exports = function getBasePlugins(webpackEnv, paths, env, options = {}) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const shouldUseReactRefresh = env.raw.FAST_REFRESH;
  const {
    defineConstants,
    ignorePluginOptions,
    htmlWebpackPluginOptions,
    miniCssExtractPluginOption,
    customPlugins = [],
  } = options;
  const plugins = [
    new webpack.ProgressPlugin({
      percentBy: "entries",
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        isEnvProduction
          ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
            ...htmlWebpackPluginOptions,
          }
          : undefined
      )
    ),

    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {}),
    new webpack.DefinePlugin({ ...env.stringified, ...defineConstants }),

    isEnvProduction &&
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: "static/css/[name].[contenthash:8].css",
      // chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].css",
      ...miniCssExtractPluginOption,
    }),

    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: paths.publicUrlOrPath,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          (fileName) => !fileName.endsWith(".map")
        );

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
      ...ignorePluginOptions,
    }),

    /** Webpack 5 中的 watchIgnorePlugin 可以防止当指定的文件或文件夹发生变化时重新构建项目
     * 其将会忽略paths中文件的变化
     */
    new webpack.WatchIgnorePlugin({
      paths: [/(css|less|s[a|c]ss)\.d\.ts$/]
    }),

    isEnvDevelopment &&
    shouldUseReactRefresh &&
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),

    // terserWebpackPlugin, webpack v5 开箱即带有最新版本的 terser-webpack-plugin, 若需要自定义添加
    ...customPlugins,
  ].filter(Boolean);

  return plugins;
};
