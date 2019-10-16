
/**
 * User: ggarrido
 * Date: 7/10/19 17:31
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Utils = require('web3-utils');

module.exports.toWei = (pht, unit = 'ether') => {
  return web3Utils.toWei(pht, unit)
};

module.exports.wei2pht = (n) => {
  return web3Utils.fromWei(n, 'ether');
};

module.exports.sha3 = (text) => {
  return web3Utils.sha3(text);
};

module.exports.toPht = (wei) => {
  return web3Utils.fromWei(wei, 'ether')
};
module.exports.isAddress = (address) => {
  return web3Utils.isAddress(address);
};

module.exports.isBN = (value) => {
  return web3Utils.isBN(value);
};

module.exports.toBN = (value) => {
  return web3Utils.toBN(value);
};
