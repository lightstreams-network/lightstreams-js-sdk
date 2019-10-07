/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('web3');
const net = require('net');
const web3Utils = require('web3-utils');

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

module.exports.getAccounts = (web3) => {
  return new Promise((resolve) => {
    web3.eth.getAccounts().then(addrs => {
      resolve(addrs.map(addr => addr.toLowerCase()));
    })
  });
};

module.exports.lockAccount = (web3, { address }) => {
  return new Promise((resolve, reject) => {
    if (typeof web3.eth.personal.lockAccount !== 'function') {
      reject(new Error(`Not supported method`))
    }

    web3.eth.personal.lockAccount(address)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.unlockAccount = (web3, { address, password, duration }) => {
  return new Promise((resolve, reject) => {
    if (typeof web3.eth.personal.unlockAccount !== 'function') {
      reject(new Error(`Not supported method`))
    }

    web3.eth.personal.unlockAccount(address, password, duration || 1000)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.importAccount = (web3, { encryptedJson, decryptedWallet }) => {
  if (typeof web3.currentProvider.importAccount !== 'function') {
    throw new Error(`Not supported method`)
  }

  web3.currentProvider.importAccount(encryptedJson, decryptedWallet);
};

module.exports.isAccountLocked = (web3, { address }) => {
  if (typeof web3.currentProvider.isAccountLocked !== 'function') {
    throw new Error(`Not supported method`)
  }

  return web3.currentProvider.isAccountLocked(address);
};

module.exports.toWei = (web3, pht) => {
  return web3Utils.toWei(pht)
};

module.exports.isAddress = (web3, { address }) => {
  return web3Utils.isAddress(address);
};

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