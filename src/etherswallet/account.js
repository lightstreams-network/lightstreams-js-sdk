/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Util = require('ethereumjs-util');

const keystore = require('./keystore');

module.exports.newAccount = (encodedJson) => {
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

      return keystore.decryptWallet(encodedJson, password)
        .then(unlockWallet => {
          wallet = unlockWallet;
        });
    },
    lock: () => {
      wallet = null;
    },
    export: () => {
      return encodedJson;
    },
    seedPhrase: () => {
      if (!wallet) throw new Error(`Account ${encodedJson.address} is locked`);
      return wallet.mnemonic;
    },
    signTx: (txParams, cb) => {
      if (!wallet) throw new Error(`Account ${encodedJson.address} is locked`);

      wallet.sign(txParams)
        .then(signedRawTx => {
          cb(null, signedRawTx)
        })
        .catch(err => {
          cb(err, null)
        })
    },
    address: Util.addHexPrefix(encodedJson.address).toLowerCase()
  }
};

module.exports.formatAddress = (address) => {
  return Util.addHexPrefix(address).toLowerCase()
};