/* eslint-disable */

const fs = require('fs');
const _ = require('lodash');
const { replaceInFile } = require('replace-in-file');

const enviorments = ['acceptance', 'production'];
const env = _.get(process, 'argv[2]');

if (enviorments.indexOf(env) < 0) {
  console.log(`Please use one of the following env arguments: ${enviorments.join(' ,')}.`);
  console.log('\nExample: "npm run change-env acceptance"\n');
  console.log("Please if you're not a programmer don't use this");
  process.exit(0);
}

console.log(`Changing environment to: ${env}`);

fs.copyFileSync(`./src/env/${env}.ts`, `./src/config/environment.ts`);
replaceInFile({
  files: './src/config/environment.ts',
  from: '@app/types/config/IConfig',
  to: '../types/config/IConfig',
});
fs.copyFileSync(`./src/env/build-env/${env}.js`, './build-env.js');