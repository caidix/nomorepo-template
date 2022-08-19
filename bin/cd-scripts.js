#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const program = require('commander');
const chalk = require('chalk');
const reg = /^(true|1|on)$/i;

function parseBool(val) {
  return reg.test(val);
}
program.version(`@cdwow/cd-cli ${require('../package.json').version}`, '-v').usage('<command> [options]');
program
  .command('start')
  .usage('[options]')
  .description('start development server')
  .option('--open [true|false]', 'open browser on server start', parseBool, true)
  .option('--mode <mode>', 'specify env mode', 'development')
  .option('--host <host>', 'specify host')
  .option('--port <port>', 'specify port')
  .allowUnknownOption()
  .action((options, cmd) => {
    console.log('appPath', 444);
    require('../scripts/start')(options, cmd.args);
  });

program
  .command('build')
  .usage('[options]')
  .description('build for production')
  .option('--mode <mode>', 'specify env mode', 'production')
  .option('--dest <outputRoot>', 'specify output directory')
  .option('--report [true|false]', 'generate report.html to help analyze bundle content', false)
  .option('--report-json [true|false]', 'generate report.json to help analyze bundle content', false)
  .allowUnknownOption()
  .action((options, cmd) => {
    require('./scripts/build')(options, cmd.args);
  });

if (!process.argv.slice(2)) {
  program.outputHelp((txt) => {
    chalk.green(txt);
  });
}

program.parse(process.argv);
