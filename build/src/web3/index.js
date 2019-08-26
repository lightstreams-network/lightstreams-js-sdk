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

module.exports.getTxReceipt = function (web3, txHash) {
  var timeoutInSec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;

  if (isLatest(web3)) {
    return latest.getTxReceipt(web3, txHash, timeoutInSec);
  } else if (isV0_20(web3)) {
    return v0_20.getTxReceipt(web3, address);
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.getBalance = function (web3, address) {
  if (isLatest(web3)) {
    return latest.getBalance(web3, address);
  } else if (isV0_20(web3)) {
    return v0_20.getBalance(web3, address);
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

module.exports.deployContract = function (web3, _ref) {
  var abi = _ref.abi,
      bytecode = _ref.bytecode,
      params = _ref.params;

  if (isLatest(web3)) {
    return latest.deployContract(web3, {
      abi: abi,
      bytecode: bytecode,
      params: params
    });
  } else if (isV0_20(web3)) {
    return v0_20.deployContract(web3, {
      abi: abi,
      bytecode: bytecode,
      params: params
    });
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.contractCall = function (web3, _ref2) {
  var abi = _ref2.abi,
      address = _ref2.address,
      method = _ref2.method,
      params = _ref2.params;

  if (isLatest(web3)) {
    return latest.contractCall(web3, {
      abi: abi,
      address: address,
      method: method,
      params: params
    });
  } else if (isV0_20(web3)) {
    return v0_20.contractCall(web3, {
      abi: abi,
      address: address,
      method: method,
      params: params
    });
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.contractSendTransaction = function (web3, _ref3) {
  var abi = _ref3.abi,
      address = _ref3.address,
      method = _ref3.method,
      params = _ref3.params;

  if (isLatest(web3)) {
    return latest.contractSendTransaction(web3, {
      abi: abi,
      address: address,
      method: method,
      params: params
    });
  } else if (isV0_20(web3)) {
    return v0_20.contractSendTransaction(web3, {
      abi: abi,
      address: address,
      method: method,
      params: params
    });
  } else {
    throw new Error('Not supported method');
  }
};