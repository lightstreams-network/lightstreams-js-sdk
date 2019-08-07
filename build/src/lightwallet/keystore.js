"use strict";

/**
 * User: ggarrido
 * Date: 5/08/19 15:53
 * Copyright 2019 (c) Lightstreams, Granada
 */
var _require = require('eth-lightwallet'),
    keystore = _require.keystore;

var _require2 = require('entropy-string'),
    Entropy = _require2.Entropy;

if (typeof global_keystore === 'undefined') {
  global_keystore = {};
}

var generateEntropy = function generateEntropy() {
  var entropy = new Entropy({
    total: 1e6,
    risk: 1e9
  });
  return entropy.string();
};

var newAddresses = function newAddresses(keystore, password) {
  var nKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return new Promise(function (resolve, reject) {
    keystore.keyFromPassword(password, function (err, pwDerivedKey) {
      if (err) {
        reject(err);
      }

      keystore.generateNewAddress(pwDerivedKey, nKeys);
      resolve();
    });
  });
};

module.exports = {
  generateRandomSeed: function generateRandomSeed() {
    var randomEntropy = generateEntropy();
    return keystore.generateRandomSeed(randomEntropy);
  },
  createPrivateKeys: function createPrivateKeys(keystoreId, seed) {
    var password = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var nKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    if (password === '') {
      password = prompt('Enter password to generate addresses', 'Password');
    }

    if (!keystore.isSeedValid(seed)) {
      throw new Error("Invalid seed phrase");
    }

    if (typeof global_keystore[keystoreId] !== 'undefined') {
      return newAddresses(global_keystore[keystoreId], password, nKeys);
    }

    return new Promise(function (resolve, reject) {
      console.log('Creating new keystore vault...');
      keystore.createVault({
        password: password,
        seedPhrase: seed,
        hdPathString: 'm/0\'/0\'/0\''
      }, function (err, ks) {
        if (err) {
          reject(err);
        }

        global_keystore[keystoreId] = ks;
        newAddresses(global_keystore[keystoreId], password, nKeys).then(resolve)["catch"](reject);
      });
    });
  },
  pwDerivedKey: function pwDerivedKey(keystoreId, password) {
    if (typeof global_keystore[keystoreId] === 'undefined') {
      throw new Error("Keystore ".concat(keystoreId, " does not exists"));
    }

    return new Promise(function (resolve, reject) {
      global_keystore[keystoreId].keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
          reject(err);
        }

        resolve(pwDerivedKey);
      });
    });
  },
  getKsVault: function getKsVault(keystoreId) {
    return global_keystore[keystoreId];
  },
  getAccounts: function getAccounts(keystoreId) {
    if (typeof global_keystore[keystoreId] === 'undefined') {
      return [];
    }

    return global_keystore[keystoreId].getAddresses();
  }
};