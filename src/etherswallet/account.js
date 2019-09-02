/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Util = require('ethereumjs-util');

const keystore = require('./keystore');

module.exports.newAccount = (encodedJson) => {
  var wallet = null;

  const getAddress = () => {
    return Util.addHexPrefix(encodedJson.address).toLowerCase()
  };

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
    signTx: (txParams, cb) => {
      if (!wallet) throw new Error(`Account ${encodedJson.address} is locked`);

      wallet.sign(txParams)
        .then(signedRawTx => {
          cb(null, signedRawTx)
        })
        .catch(err => {
          cb(err, '0x0')
        })

      // debugger;
      // const privateKey = Buffer.from(Util.stripHexPrefix(wallet.signingKey.privateKey), 'hex');
      // // const tx = new EthereumTx(txParams);
      // const tx = new EthereumTx(txParams, { common: network });
      // tx.sign(privateKey);
      // const signedBufferTx = tx.serialize();
      // return Util.bufferToHex(signedBufferTx);
    },
    address: getAddress()
  }
};