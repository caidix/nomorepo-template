/** 这两行需要放在最顶层已确保变量存在否则env会抛错噢 */
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const ip = require("internal-ip");
const detectport = require("detect-port");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const paths = require("../config/paths");
const getClientEnvironment = require("../config/env");
const baseOptions = require("../config/base-options");
const getWebpackConfig = require("../config/webpack.config");
const getDevServerOptions = require("../config/devServer.conf");

/**
 * 获取自定义修改的配置文件
 */
function getCustomOptions(appPath) {
  const dir = path.resolve(appPath, "config");
  if (fs.existsSync(dir)) {
    console.log(1321321);
    return require(`${dir}/config.js`)();
  }
  return {};
}

/**
 * 获取自定义修改的路径文件
 */
function getCustomPaths(appPath) {
  const dir = path.resolve(appPath, "paths");
  if (fs.existsSync(dir)) {
    return require(`${dir}/paths.js`)();
  }
  return {};
}

async function start(cliOptions, args) {
  const appPath = process.cwd();
  const newOptions = await getCustomOptions(appPath);
  console.log("appPath", appPath);

  /** Paths */
  const customPaths = await getCustomPaths(appPath);
  const newPaths = { ...paths, customPaths };

  try {
    await buildDev(
      newPaths,
      getClientEnvironment(newPaths.publicUrlOrPath.slice(0, -1)),
      {
        ...baseOptions,
        ...newOptions,
        ...cliOptions,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function buildDev(paths, env, options) {
  const webpackConfig = getWebpackConfig(paths, env, options);
  const protocol = process.env.HTTPS === "true" ? "https" : "http";
  const appName = require(paths.appPackageJson).name;

  /** devServer Proxy 配置 */
  const customDevServerOption = options.devServer || {};
  const baseDevServerOption = getDevServerOptions(paths);
  const devServerOptions = Object.assign(
    {},
    baseDevServerOption,
    customDevServerOption
  );

  if (devServerOptions.useLocalIp) {
    devServerOptions.host = ip.v4.sync();
  }
  delete devServerOptions.useLocalIp;

  const originPort = parseInt(devServerOptions.port);
  const availablePort = await detectport(originPort);

  if (originPort !== availablePort) {
    console.log(
      `预览端口 ${originPort} 被占用, 自动切换到空闲端口 ${availablePort}`
    );
    devServerOptions.port = availablePort;
  }
  console.log({ devServerOptions });
  // WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);

  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(devServerOptions, compiler);
  server.startCallback(() => {
    console.log(chalk.cyan("Starting the development server...\n"));
  });
  // return new Promise((resolve, reject) => {
  //   compiler.hooks.done.tap('cd-script start', (stats) => {
  //     if (stats.hasErrors()) {
  //       return reject();
  //     }
  //     console.log('  App running at:');
  //     const localhost = `http://${devServerOptions.host}:${devServerOptions.port}/${devServerOptions.openPage}`;
  //     console.log(localhost);
  //     console.log(`  - Local: ${chalk.cyan(localhost)}`);
  //     console.log();
  //     if (process.env.NODE_ENV !== 'production') {
  //       const buildCommand = 'yarn build';
  //       console.log('  Note that the development build is not optimized.');
  //       console.log(`  To create a production build, run ${chalk.cyan(buildCommand)}.`);
  //     }
  //     resolve();
  //   });
  //   server.listen(devServerOptions.port, (err) => {
  //     if (err) {
  //       reject(err);
  //       return console.log(err);
  //     }
  //   });
  // });
}

module.exports = start;
