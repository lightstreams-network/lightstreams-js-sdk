"use strict";

/**
 * User: ggarrido
 * Date: 7/10/19 17:31
 * Copyright 2019 (c) Lightstreams, Granada
 */
module.exports.getAccounts = function (web3) {
  return new Promise(function (resolve) {
    web3.eth.getAccounts().then(function (addrs) {
      resolve(addrs.map(function (addr) {
        return addr.toLowerCase();
      }));
    });
  });
};

module.exports.getPrivateKey = function (web3, _ref) {
  var address = _ref.address;
  return new Promise(function (resolve, reject) {
    if (typeof web3.currentProvider._getAccount !== 'function') {
      reject(new Error("Not supported method"));
    }

    if (web3.currentProvider.isAccountLocked(address)) {
      reject(new Error("Account is locked"));
    }

    var privKey = web3.currentProvider._getAccount(address).privateKey();

    resolve(privKey);
  });
};

module.exports.lockAccount = function (web3, _ref2) {
  var address = _ref2.address;
  return new Promise(function (resolve, reject) {
    if (typeof web3.eth.personal.lockAccount !== 'function') {
      reject(new Error("Not supported method"));
    }

    web3.eth.personal.lockAccount(address).then(resolve)["catch"](reject);
  });
};

module.exports.unlockAccount = function (web3, _ref3) {
  var address = _ref3.address,
      password = _ref3.password,
      duration = _ref3.duration;
  return new Promise(function (resolve, reject) {
    if (typeof web3.eth.personal.unlockAccount !== 'function') {
      reject(new Error("Not supported method"));
    }

    web3.eth.personal.unlockAccount(address, password, duration || 1000).then(resolve)["catch"](reject);
  });
};

module.exports.importAccount = function (web3, _ref4) {
  var encryptedJson = _ref4.encryptedJson,
      decryptedWallet = _ref4.decryptedWallet;

  if (typeof web3.currentProvider.importAccount !== 'function') {
    throw new Error("Not supported method");
  }

  web3.currentProvider.importAccount(encryptedJson, decryptedWallet);
};

module.exports.isAccountLocked = function (web3, _ref5) {
  var address = _ref5.address;

  if (typeof web3.currentProvider.isAccountLocked !== 'function') {
    throw new Error("Not supported method");
  }

  return web3.currentProvider.isAccountLocked(address);
};

module.exports.signAuthToken = function (web3, _ref6, cb) {
  var msg = _ref6.msg,
      address = _ref6.address;

  if (typeof web3.currentProvider._getAccount !== 'function') {
    throw new Error("Not supported method");
  }

  var account = web3.currentProvider._getAccount(address);

  return account.signAuthToken({
    msg: msg
  }, cb);
};

module.exports.exportMnemonic = function (web3, _ref7) {
  var address = _ref7.address;

  if (typeof web3.currentProvider._getAccount !== 'function') {
    throw new Error("Not supported method");
  }

  var account = web3.currentProvider._getAccount(address);

  return account.seedPhrase();
};