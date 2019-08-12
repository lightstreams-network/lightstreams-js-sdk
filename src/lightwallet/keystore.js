/**
 * User: ggarrido
 * Date: 5/08/19 15:53
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { keystore } = require('eth-lightwallet');
const { Entropy } = require('entropy-string');

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
  createKeystoreVault: (seed, password, nKeys = 1) => {
    return new Promise((resolve, reject) => {
      if (!keystore.isSeedValid(seed)) {
        reject(`Invalid seed phrase`);
      }

      console.log('Creating new keystore vault...');
      keystore.createVault({
        password: password,
        seedPhrase: seed,
        hdPathString: 'm/0\'/0\'/0\''
      }, function(err, ks) {
        if (err) {
          reject(err)
        }

        newAddresses(ks, password, nKeys)
          .then(() => resolve(ks))
          .catch(reject);
      });
    });
  },
  createPrivateKey: (ksVault, password, nKeys = 1) => {
    return newAddresses(ks, password, nKeys)
      .then(() => resolve(ks))
      .catch(reject);
  },
  pwDerivedKey: (ksVault, password) => {
    return new Promise((resolve, reject) => {
      ksVault.keyFromPassword(password, function(err, pwDerivedKey) {
        if (err) {
          reject(err);
        }
        resolve(pwDerivedKey);
      });
    });
  },
  addresses: (ksVault) => {
    return ksVault.addresses;
  },
  deserializeKeystoreVault: (serializedVault) => {
    return keystore.deserialize(serializedVault);
  },
  serializeKeystoreVault: (ksVault) => {
    return ksVault.serialize();
  }
};