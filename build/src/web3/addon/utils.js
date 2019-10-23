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

module.exports.wei2pht = function (n) {
  return web3Utils.fromWei(n, 'ether');
};

module.exports.sha3 = function (text) {
  return web3Utils.sha3(text);
};

module.exports.toPht = function (wei) {
  return web3Utils.fromWei(wei, 'ether');
};

module.exports.isAddress = function (address) {
  return web3Utils.isAddress(address);
};

module.exports.isBN = function (value) {
  return web3Utils.isBN(value);
};

module.exports.toBN = function (value) {
  return web3Utils.toBN(value);
};

module.exports.toHex = function (value) {
  return web3Utils.toHex(value);
};

module.exports.toAscii = function (value) {
  return web3Utils.hexToAscii(value);
};

module.exports.toUtf8 = function (value) {
  return web3Utils.hexToUtf8(value);
};