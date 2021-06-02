#!/usr/bin/env sh
# to install dependencies, use this before run-test.sh

cd ../

if hash yarn
then
  yarn install
  cd ./examples/test-app/
  yarn install
else
  npm install
  cd ./examples/test-app/
  npm install
fi