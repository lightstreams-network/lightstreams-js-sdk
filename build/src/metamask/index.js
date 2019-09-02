"use strict";

var _this = void 0;

/**
 * User: ggarrido
 * Date: 14/08/19 9:49
 * Copyright 2019 (c) Lightstreams, Granada
 */
module.exports.isInstalled = function () {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

module.exports.isConnected = function () {
  return _this.isInstalled && typeof window.web3 !== 'undefined' && window.web3.isConnected();
};

module.exports.isEnabled = function () {
  return _this.isConnected() && typeof window.ethereum.selectedAddress !== 'undefined';
};

module.exports.enable = function () {
  return window.ethereum.enable();
};

module.exports.selectedAddress = function () {
  if (!_this.isConnected()) {
    throw new Error('Web3 is not connected');
  }

  return window.ethereum.selectedAddress;
};

module.exports.web3 = function () {
  return window.web3;
};