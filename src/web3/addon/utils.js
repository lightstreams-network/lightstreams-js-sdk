
/**
 * User: ggarrido
 * Date: 7/10/19 17:31
 * Copyright 2019 (c) Lightstreams, Granada
 */

const web3Utils = require('web3-utils');

module.exports.toWei = (pht) => {
  return web3Utils.toWei(pht)
};

module.exports.isAddress = (address) => {
  return web3Utils.isAddress(address);
};