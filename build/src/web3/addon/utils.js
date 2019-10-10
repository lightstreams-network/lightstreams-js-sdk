"use strict";

/**
 * User: ggarrido
 * Date: 7/10/19 17:31
 * Copyright 2019 (c) Lightstreams, Granada
 */
var web3Utils = require('web3-utils');

module.exports.toWei = function (pht) {
  var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ether';
  return web3Utils.toWei(pht, unit);
};

module.exports.isAddress = function (address) {
  return web3Utils.isAddress(address);
};

module.exports.sha3 = function (text) {
  return web3Utils.sha3(text);
};