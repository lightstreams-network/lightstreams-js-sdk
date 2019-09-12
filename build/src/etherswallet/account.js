"use strict";

/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Util = require('ethereumjs-util');

var keystore = require('./keystore');

function isPromise(obj) {
  return obj && Object.prototype.toString.call(obj) === "[object Promise]"; // if(!obj) return false;
  // if(typeof obj !== 'object') return false;
  // return typeof obj.then === 'function';
}

module.exports.newAccount = function (encryptedJson) {
  var decryptedWallet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var wallet = decryptedWallet;
  return {
    isLocked: function isLocked() {
      return wallet === null;
    },
    unlock: function unlock(password) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      setTimeout(function () {
        wallet = null;
      }, timeout);
      return keystore.decryptWallet(encryptedJson, password).then(function (unlockWallet) {
        wallet = unlockWallet;
      });
    },
    lock: function lock() {
      wallet = null;
    },
    "export": function _export() {
      return encryptedJson;
    },
    seedPhrase: function seedPhrase() {
      if (!wallet) throw new Error("Account ".concat(encryptedJson.address, " is locked"));
      return wallet.mnemonic;
    },
    signTx: function signTx(txParams, cb) {
      if (!wallet) throw new Error("Account ".concat(encryptedJson.address, " is locked"));
      wallet.sign(txParams).then(function (signedRawTx) {
        cb(null, signedRawTx);
      })["catch"](function (err) {
        cb(err, null);
      });
    },
    address: Util.addHexPrefix(encryptedJson.address).toLowerCase()
  };
};

module.exports.formatAddress = function (address) {
  return Util.addHexPrefix(address).toLowerCase();
};