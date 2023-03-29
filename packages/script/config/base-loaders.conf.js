const getCSSModuleLocalIdent = require("../utils/getCSSModuleLocalIdent");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

/** 默认开启source-map */
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

/** 默认图片处理方式最大值 */
const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const hasJsxRuntime = (() => {
  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

function getBaseLoader(webpackEnv, paths, env, options = {}) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const shouldUseReactRefresh = env.raw.FAST_REFRESH;

  function getStyleLoaders(
    cssOptions,
    preProcessor = {
      loader: "",
      options: {},
    },
    resourcesOptions
  ) {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith(".")
          ? { publicPath: "../../" }
          : {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve("postcss-loader"),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: "postcss",
            config: false,
            plugins: [
              "postcss-flexbugs-fixes",
              [
                "postcss-preset-env",
                {
                  autoprefixer: {
                    flexbox: "no-2009",
                  },
                  stage: 3,
                },
              ],
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              "postcss-normalize",
            ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor.loader) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor.loader),
          options: {
            sourceMap: true,
            ...preProcessor.options,
          },
        }
      );
    }
    if (resourcesOptions) {
      loaders.push({
        loader: require.resolve("style-resources-loader"),
        options: resourcesOptions,
      });
    }
    return loaders;
  }

  const {
    svgOptions,
    fileLoaderOptions,
    sassLoaderOptions,
    lessLoaderOptions,
    // https://github.com/yenshih/style-resources-loader
    resourcesLoaderOptions,
  } = options || {};
  const rules = [
    shouldUseSourceMap && {
      enforce: "pre",
      exclude: /@babel(?:\/|\\{1,2})runtime/,
      test: /\.(js|mjs|jsx|ts|tsx|css)$/,
      loader: require.resolve("source-map-loader"),
    },
    {
      oneOf: [
        {
          test: [/\.avif$/],
          type: "asset",
          mimetype: "image/avif",
          parser: {
            dataUrlCondition: {
              maxSize: imageInlineSizeLimit,
            },
          },
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: imageInlineSizeLimit,
            },
          },
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: require.resolve("@svgr/webpack"),
              options: {
                prettier: false,
                svgo: false,
                svgoConfig: {
                  plugins: [{ removeViewBox: false }],
                },
                titleProp: true,
                ref: true,
                ...svgOptions,
              },
            },
            {
              loader: require.resolve("file-loader"),
              options: {
                name: "static/media/[name].[hash].[ext]",
                ...fileLoaderOptions,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve("babel-loader"),
          options: {
            customize: require.resolve(
              "babel-preset-react-app/webpack-overrides"
            ),
            presets: [
              [
                require.resolve("babel-preset-react-app"),
                {
                  runtime: hasJsxRuntime ? "automatic" : "classic",
                },
              ],
            ],

            plugins: [
              isEnvDevelopment &&
                shouldUseReactRefresh &&
                require.resolve("react-refresh/babel"),
            ].filter(Boolean),
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
            compact: isEnvProduction,
          },
        },
        {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [
              [
                require.resolve("babel-preset-react-app/dependencies"),
                { helpers: true },
              ],
            ],
            cacheDirectory: true,
            cacheCompression: false,

            // Babel sourcemaps are needed for debugging into node_modules
            // code.  Without the options below, debuggers like VSCode
            // show incorrect code and set breakpoints on the wrong lines.
            sourceMaps: shouldUseSourceMap,
            inputSourceMap: shouldUseSourceMap,
          },
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: "icss",
            },
          }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: "local",
              getLocalIdent: getCSSModuleLocalIdent,
            },
          }),
        },
        // Opt-in support for SASS (using .scss or .sass extensions).
        // By default we support SASS Modules with the
        // extensions .module.scss or .module.sass
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
              modules: {
                mode: "icss",
              },
            },
            {
              loader: "sass-loader",
              options: sassLoaderOptions,
            },
            resourcesLoaderOptions.scssConfig
          ),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules, but using SASS
        // using the extension .module.scss or .module.sass
        {
          test: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
              modules: {
                mode: "local",
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
            {
              loader: "sass-loader",
            },
            resourcesLoaderOptions.scssConfig
          ),
        },
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
            },
            {
              loader: "less-loader",
              options: lessLoaderOptions,
            },
            resourcesLoaderOptions.lessConfig
          ),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        {
          test: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
            {
              loader: "less-loader",
            },
            resourcesLoaderOptions.lessConfig
          ),
        },
        {
          // Exclude `js` files to keep "css" loader working as it injects
          // its runtime that would otherwise be processed through "file" loader.
          // Also exclude `html` and `json` extensions so they get processed
          // by webpacks internal loaders.
          exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          type: "asset/resource",
        },
      ].filter(Boolean),
    },
  ];

  return rules;
}

module.exports = getBaseLoader;
