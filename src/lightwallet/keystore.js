/**
 * User: ggarrido
 * Date: 5/08/19 15:53
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { keystore } = require('eth-lightwallet');
const { Entropy } = require('entropy-string');

if (typeof global_keystore === 'undefined') {
  global_keystore = {};
}

const generateEntropy = () => {
  const entropy = new Entropy({ total: 1e6, risk: 1e9 });
  return entropy.string()
};

const newAddresses = (keystore, password, nKeys = 1) => {
  return new Promise((resolve, reject) => {
    keystore.keyFromPassword(password, function(err, pwDerivedKey) {
      if (err) {
        reject(err)
      }
      keystore.generateNewAddress(pwDerivedKey, nKeys);
      resolve();
    });
  });
};

module.exports = {
  generateRandomSeed: () => {
    const randomEntropy = generateEntropy();
    return keystore.generateRandomSeed(randomEntropy);
  },
  createPrivateKeys: (keystoreId, seed, password = '', nKeys = 1) => {
    if (password === '') {
      password = prompt('Enter password to generate addresses', 'Password');
    }

    if(!keystore.isSeedValid(seed)) {
      throw new Error(`Invalid seed phrase`);
    }

    if (typeof global_keystore[keystoreId] !== 'undefined') {
      return newAddresses(global_keystore[keystoreId], password, nKeys);
    }

    return new Promise((resolve, reject) => {
      console.log('Creating new keystore vault...');
      keystore.createVault({
        password: password,
        seedPhrase: seed,
        hdPathString: 'm/0\'/0\'/0\''
      }, function(err, ks) {
        if (err) {
          reject(err)
        }
        global_keystore[keystoreId] = ks;
        newAddresses(global_keystore[keystoreId], password, nKeys).then(resolve).catch(reject);
      });
    });
  },
  pwDerivedKey: (keystoreId, password) => {
    if (typeof global_keystore[keystoreId] === 'undefined') {
      throw new Error(`Keystore ${keystoreId} does not exists`);
    }
    return new Promise((resolve, reject) => {
      global_keystore[keystoreId].keyFromPassword(password, function(err, pwDerivedKey) {
        if (err) {
          reject(err);
        }

        resolve(pwDerivedKey);
      });
    });
  },
  getKsVault: (keystoreId) => {
    return global_keystore[keystoreId];
  },
  getAccounts: (keystoreId) => {
    if (typeof global_keystore[keystoreId] === 'undefined') {
      return [];
    }

    return global_keystore[keystoreId].getAddresses();
  }
};