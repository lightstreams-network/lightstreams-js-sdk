"use strict";

/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ethUtil = require('ethereumjs-util'); // const ethers = require('ethers');


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

      if (timeout) {
        setTimeout(function () {
          wallet = null;
        }, timeout);
      }

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
    privateKey: function privateKey() {
      if (!wallet) throw new Error("Account ".concat(encryptedJson.address, " is locked"));
      return wallet.privateKey;
    },
    // Code extracted from @openzeppelin/gsn-provider/src/PrivateKeyProvider.js
    signTx: function signTx(txParams, cb) {
      if (!wallet) throw new Error("Account ".concat(encryptedJson.address, " is locked"));
      wallet.sign(txParams).then(function (signedRawTx) {
        cb(null, signedRawTx);
      })["catch"](function (err) {
        cb(err, null);
      });
    },
    signMsg: function signMsg(_ref, cb) {
      var data = _ref.data,
          chainId = _ref.chainId;
      if (!wallet) throw new Error("Account ".concat(encryptedJson.address, " is locked"));
      var dataBuff = ethUtil.toBuffer(data);
      var msgHash = ethUtil.hashPersonalMessage(dataBuff);
      var sig = ethUtil.ecsign(msgHash, ethUtil.toBuffer(wallet.privateKey));
      var signedMsg = ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
      cb(null, signedMsg);
    },
    address: ethUtil.addHexPrefix(encryptedJson.address).toLowerCase()
  };
};

module.exports.formatAddress = function (address) {
  return ethUtil.addHexPrefix(address).toLowerCase();
}; // Copied from https://github.com/MetaMask/web3-provider-engine/blob/master/subproviders/hooked-wallet-ethtx.js


function concatSig(v, r, s) {
  r = ethUtil.fromSigned(r);
  s = ethUtil.fromSigned(s);
  v = ethUtil.bufferToInt(v);
  r = ethUtil.toUnsigned(r).toString('hex').padStart(64, 0);
  s = ethUtil.toUnsigned(s).toString('hex').padStart(64, 0);
  v = ethUtil.stripHexPrefix(ethUtil.intToHex(v));
  return ethUtil.addHexPrefix(r.concat(s, v).toString("hex"));
}