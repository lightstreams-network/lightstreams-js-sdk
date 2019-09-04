"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */
var latest = require('./latest');

var v0_20 = require('./v0_20');

var isLatest = function isLatest(web3) {
  return typeof web3.version === 'string' && web3.version.indexOf('1.') === 0;
};

var isV0_20 = function isV0_20(web3) {
  return _typeof(web3.version) === 'object' && web3.version.api.indexOf('0.20') === 0;
};

module.exports.initialize = function (provider) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return latest.initialize(provider, options);
};

module.exports.networkVersion = function (web3) {
  if (isLatest(web3)) {
    return latest.networkVersion(web3);
  } else if (isV0_20(web3)) {
    return v0_20.networkVersion(web3);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.lockAccount = function (web3, _ref) {
  var address = _ref.address;
  return new Promise(function (resolve, reject) {
    web3.eth.personal.lockAccount(address).then(resolve)["catch"](reject);
  });
};

module.exports.unlockAccount = function (web3, _ref2) {
  var address = _ref2.address,
      password = _ref2.password,
      duration = _ref2.duration;
  return new Promise(function (resolve, reject) {
    web3.eth.personal.unlockAccount(address, password, duration || 1000).then(resolve)["catch"](reject);
  });
};

module.exports.importAccount = function (web3, _ref3) {
  var encryptedJson = _ref3.encryptedJson;

  if (typeof web3.currentProvider.importAccount !== 'function') {
    throw new Error("Not supported method");
  }

  web3.currentProvider.importAccount(encryptedJson);
};

module.exports.exportMnemonic = function (web3, _ref4) {
  var address = _ref4.address;

  if (typeof web3.currentProvider._getAccount !== 'function') {
    throw new Error("Not supported method");
  }

  var account = web3.currentProvider._getAccount(address);

  return account.seedPhrase();
};

module.exports.isAccountLocked = function (web3, _ref5) {
  var address = _ref5.address;

  if (typeof web3.currentProvider.isAccountLocked !== 'function') {
    throw new Error("Not supported method");
  }

  return web3.currentProvider.isAccountLocked(address);
};

module.exports.getTxReceipt = function (web3, payload) {
  if (isLatest(web3)) {
    return latest.getTxReceipt(web3, payload);
  } else if (isV0_20(web3)) {
    return v0_20.getTxReceipt(web3, payload);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.getBalance = function (web3, payload) {
  if (isLatest(web3)) {
    return latest.getBalance(web3, payload);
  } else if (isV0_20(web3)) {
    return v0_20.getBalance(web3, payload);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.sendRawTransaction = function (web3, rawSignedTx) {
  if (isLatest(web3)) {
    return latest.sendRawTransaction(web3, rawSignedTx);
  } else if (isV0_20(web3)) {
    return v0_20.sendRawTransaction(web3, rawSignedTx);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.deployContract = function (web3, payload) {
  if (isLatest(web3)) {
    return latest.deployContract(web3, payload);
  } else if (isV0_20(web3)) {
    return v0_20.deployContract(web3, payload);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.contractCall = function (web3, contractAddress, payload) {
  if (isLatest(web3)) {
    return latest.contractCall(web3, contractAddress, payload);
  } else if (isV0_20(web3)) {
    return v0_20.contractCall(web3, contractAddress, payload);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.contractSendTx = function (web3, contractAddress, payload) {
  if (isLatest(web3)) {
    return latest.contractSendTx(web3, contractAddress, payload);
  } else if (isV0_20(web3)) {
    return v0_20.contractSendTx(web3, contractAddress, payload);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.isAddress = function (web3, _ref6) {
  var address = _ref6.address;
  return web3.utils.isAddress(address);
};

module.exports.getAccounts = function (web3) {
  return web3.eth.getAccounts();
};