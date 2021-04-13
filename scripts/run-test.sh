#!/usr/bin/env sh
cd ../

if hash yarn
then
  yarn build
  cd ./examples/test-app
  yarn remove @studiohyperdrive/nestjs-monitor
  yarn add ../../
  node ../../dist/examples/test-app/src/main.js
else
  npm run build
  cd ./examples/test-app
  npm remove @studiohyperdrive/nestjs-monitor
  npm install ../../
  node ../../dist/examples/test-app/src/main.js
fi