/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Util = require('ethereumjs-util');

const keystore = require('./keystore');

module.exports.newAccount = (encryptedJson) => {
  let wallet = null;

  return {
    isLocked: () => {
      return wallet === null;
    },
    // @TODO Implemented auto-lock based on timeout
    unlock: (password, timeout = 0) => {
      setTimeout(function() {
        wallet = null;
      }, timeout);

      return keystore.decryptWallet(encryptedJson, password)
        .then(unlockWallet => {
          wallet = unlockWallet;
        });
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