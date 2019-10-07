/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('web3');
const net = require('net');

const latest = require('./latest');
const v0_20 = require('./v0_20');

const isLatest = (web3) => {
  return typeof web3.version === 'string' && web3.version.indexOf('1.') === 0;
};

const isV0_20 = (web3) => {
  return typeof web3.version === 'object' && web3.version.api.indexOf('0.20') === 0;
};

const defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000,
};

module.exports.initialize = async (provider, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = new Web3(provider || defaultCfg.provider, net, {
        defaultGasPrice: options.gasPrice || defaultCfg.gasPrice,
      });

      resolve(web3);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.keystore = require('./addon/keystore');

module.exports.utils = require('./addon/utils');

[...Object.keys(latest), ...Object.keys(isV0_20)].forEach(method => {
  module.exports[method] = (web3, payload) => {
    let methodCall;
    if(isLatest(web3)) {
      methodCall = latest[method];
    } else if (isV0_20(web3)) {
      methodCall = v0_20[method];
    } else {
      throw new Error(`Not support web3js version`);
    }

    if (typeof methodCall === 'function') {
      return methodCall(web3, payload);
    } else {
      throw new Error(`Not implemented method ${method}()`);
    }
  }
});