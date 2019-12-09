/**
 * User: ggarrido
 * Date: 30/08/19 13:20
 * Copyright 2019 (c) Lightstreams, Granada
 */

const ethUtil = require('ethereumjs-util');
// const ethers = require('ethers');

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
      if(timeout) {
        setTimeout(() => {
          wallet = null;
        }, timeout * 1000);
      }

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
    privateKey: () => {
      if (!wallet) throw new Error(`Account ${encryptedJson.address} is locked`);
      return wallet.privateKey;
    },
    // Code extracted from @openzeppelin/gsn-provider/src/PrivateKeyProvider.js
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
    signMsg: ({ data, chainId }, cb) => {
      if (!wallet) throw new Error(`Account ${encryptedJson.address} is locked`);

      const dataBuff = ethUtil.toBuffer(data);
      const msgHash = ethUtil.hashPersonalMessage(dataBuff);
      const sig = ethUtil.ecsign(msgHash, ethUtil.toBuffer(wallet.privateKey));
      const signedMsg = ethUtil.bufferToHex(concatSig(sig.v, sig.r, sig.s));
      cb(null, signedMsg);
    },
    signAuthToken: ({ msg }, cb) => {
      if (!wallet) throw new Error(`Account ${encryptedJson.address} is locked`);

      const msgHash = ethUtil.keccak256(msg);
      const msgHashBuffer = ethUtil.toBuffer(msgHash);

      const sig = ethUtil.ecsign(msgHashBuffer, ethUtil.toBuffer(wallet.privateKey));
      const sigHash = ethUtil.toRpcSig(sig.v, sig.r, sig.s).toString('hex');

      cb(null, sigHash);
    },

    address: ethUtil.addHexPrefix(encryptedJson.address).toLowerCase()
  }
};

module.exports.formatAddress = (address) => {
  return ethUtil.addHexPrefix(address).toLowerCase()
};

// Copied from https://github.com/MetaMask/web3-provider-engine/blob/master/subproviders/hooked-wallet-ethtx.js
function concatSig(v, r, s) {
  r = ethUtil.fromSigned(r);
  s = ethUtil.fromSigned(s);
  v = ethUtil.bufferToInt(v);
  r = ethUtil.toUnsigned(r).toString('hex').padStart(64, 0);
  s = ethUtil.toUnsigned(s).toString('hex').padStart(64, 0);
  v = ethUtil.stripHexPrefix(ethUtil.intToHex(v));
  return ethUtil.addHexPrefix(r.concat(s, v).toString("hex"))
}
