
echo "Create provisional symb link for js-sdk..."npm run link-sdk-js
rm -rf ./node_modules/lightstreams-js-sdk/src
ln -s ../../../../src node_modules/lightstreams-js-sdk/src
rm -rf ./node_modules/lightstreams-js-sdk/build
ln -s ../../../../build node_modules/lightstreams-js-sdk/build