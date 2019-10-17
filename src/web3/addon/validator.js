
/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 17/10/19 10:45
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Utils = require('web3-utils');

module.exports.validateAddress = (argName, argValue) => {
  if (!web3Utils.isAddress(argValue)) {
    throw new Error(`Invalid argument "${argName}": "${argValue}". Expected a valid eth address`);
  }
};

module.exports.isAddress = (address) => {
  return web3Utils.isAddress(address);
};

module.exports.isBN = (value) => {
  return web3Utils.isBN(value);
};
