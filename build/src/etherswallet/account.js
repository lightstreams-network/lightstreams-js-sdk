"use strict";

/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Util = require('ethereumjs-util');

var keystore = require('./keystore');

module.exports.newAccount = function (encodedJson) {
  var wallet = null;
  return {
    isLocked: function isLocked() {
      return wallet === null;
    },
    // @TODO Implemented auto-lock based on timeout
    unlock: function unlock(password) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      setTimeout(function () {
        wallet = null;
      }, timeout);
      return keystore.decryptWallet(encodedJson, password).then(function (unlockWallet) {
        wallet = unlockWallet;
      });
    },
    lock: function lock() {
      wallet = null;
    },
    "export": function _export() {
      return encodedJson;
    },
    signTx: function signTx(txParams, cb) {
      if (!wallet) throw new Error("Account ".concat(encodedJson.address, " is locked"));
      wallet.sign(txParams).then(function (signedRawTx) {
        cb(null, signedRawTx);
      })["catch"](function (err) {
        cb(err, null);
      });
    },
    address: Util.addHexPrefix(encodedJson.address).toLowerCase()
  };
};

module.exports.formatAddress = function (address) {
  return Util.addHexPrefix(address).toLowerCase();
};