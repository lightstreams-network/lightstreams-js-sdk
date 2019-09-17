/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Util = require('ethereumjs-util');

const keystore = require('./keystore');

function isPromise(obj) {
  return obj && Object.prototype.toString.call(obj) === "[object Promise]";
  // if(!obj) return false;
  // if(typeof obj !== 'object') return false;
  // return typeof obj.then === 'function';
}

module.exports.newAccount = (encryptedJson, decryptedWallet = null) => {
  let wallet = decryptedWallet;

  return {
    isLocked: () => {
      return wallet === null;
    },
    unlock: (password, timeout = 0) => {
      // @TODO Session timeout for unlocked accounts
      // setTimeout(function() {
      //   wallet = null;
      // }, timeout);

      return keystore.decryptWallet(encryptedJson, password)
        .then(unlockWallet => {
          wallet = unlockWallet;
        })
    },
    lock: () => {
      wallet = null;
    },
    export: () => {
      return encryptedJson;
    },
    seedPhrase: () => {
      if (!wallet) throw new Error(`Account ${encryptedJson.address} is locked`);
      return wallet.mnemonic;
    },
    signTx: (txParams, cb) => {
      if (!wallet) throw new Error(`Account ${encryptedJson.address} is locked`);

      wallet.sign(txParams)
        .then(signedRawTx => {
          cb(null, signedRawTx)
        })
        .catch(err => {
          cb(err, null)
        })
    },
    address: Util.addHexPrefix(encryptedJson.address).toLowerCase()
  }
};

module.exports.formatAddress = (address) => {
  return Util.addHexPrefix(address).toLowerCase()
};