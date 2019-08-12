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
  createKeystoreVault: function createKeystoreVault(seed, password) {
    var nKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return new Promise(function (resolve, reject) {
      if (!keystore.isSeedValid(seed)) {
        reject("Invalid seed phrase");
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

        newAddresses(ks, password, nKeys).then(function () {
          return resolve(ks);
        })["catch"](reject);
      });
    });
  },
  createPrivateKey: function createPrivateKey(ksVault, password) {
    var nKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return newAddresses(ks, password, nKeys).then(function () {
      return resolve(ks);
    })["catch"](reject);
  },
  pwDerivedKey: function pwDerivedKey(ksVault, password) {
    return new Promise(function (resolve, reject) {
      ksVault.keyFromPassword(password, function (err, pwDerivedKey) {
        if (err) {
          reject(err);
        }

        resolve(pwDerivedKey);
      });
    });
  },
  addresses: function addresses(ksVault) {
    return ksVault.addresses;
  },
  deserializeKeystoreVault: function deserializeKeystoreVault(serializedVault) {
    return keystore.deserialize(serializedVault);
  },
  serializeKeystoreVault: function serializeKeystoreVault(ksVault) {
    return ksVault.serialize();
  }
};