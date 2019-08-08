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
  createPrivateKeys: function createPrivateKeys(keystoreId, seed, password) {
    var nKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    return new Promise(function (resolve, reject) {
      if (!keystore.isSeedValid(seed)) {
        reject("Invalid seed phrase");
      }

      if (typeof global_keystore[keystoreId] !== 'undefined') {
        newAddresses(global_keystore[keystoreId], password, nKeys);
        resolve(global_keystore[keystoreId]);
      }

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
        newAddresses(global_keystore[keystoreId], password, nKeys).then(function () {
          return resolve(ks);
        })["catch"](reject);
      });
    });
  },
  pwDerivedKey: function pwDerivedKey(keystoreId, password) {
    return new Promise(function (resolve, reject) {
      if (typeof global_keystore[keystoreId] === 'undefined') {
        reject("Keystore ".concat(keystoreId, " does not exists"));
      }

      global_keystore[keystoreId].keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
          reject(err);
        }

        resolve(pwDerivedKey);
      });
    });
  },
  keystoreVault: function keystoreVault(keystoreId) {
    return global_keystore[keystoreId];
  },
  restoreKeystoreVault: function restoreKeystoreVault(keystoreId, serializedVault) {
    global_keystore[keystoreId] = keystore.deserialize(serializedVault);
  },
  globalKeystoreVault: function globalKeystoreVault() {
    return global_keystore;
  },
  accounts: function accounts(keystoreId) {
    if (typeof global_keystore[keystoreId] === 'undefined') {
      return [];
    }

    return global_keystore[keystoreId].addresses;
  }
};