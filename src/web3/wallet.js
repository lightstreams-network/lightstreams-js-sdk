/**
 * User: ggarrido
 * Date: 5/08/19 15:53
 * Copyright 2019 (c) Lightstreams, Granada
 */

const lightwallet = require('eth-lightwallet');
const { Entropy } = require('entropy-string');

const generateEntropy = () => {
  const entropy = new Entropy({ total: 1e6, risk: 1e9 })
  return entropy.string()
};

const newAddresses = (keystore, password) => {
  if (password === '') {
    password = prompt('Enter password to retrieve addresses', 'Password');
  }

  var numAddr = parseInt(document.getElementById('numAddr').value);

  keystore.keyFromPassword(password, function(err, pwDerivedKey) {
    keystore.generateNewAddress(pwDerivedKey, numAddr);
  });
}

const setWeb3Provider = (keystore) => {
  var web3Provider = new HookedWeb3Provider({
    host: 'https://node.sirius.lightstreams.io',
    transaction_signer: keystore
  });

  web3.setProvider(web3Provider);
};

module.exports = (web3provider) => {
  let keystore;
  return {
    createPrivateKey: () => {
      const randomEntropy = generateEntropy();
      const password = generateEntropy();

      var randomSeed = lightwallet.keystore.generateRandomSeed(randomEntropy);
      console.log('Seed: ', randomSeed);
      console.log('Password: ', password);

      if (typeof keystore === 'undefined') {
        lightwallet.keystore.createVault({
          password: password,
          seedPhrase: randomSeed,
          hdPathString: 'm/0\'/0\'/0\''
        }, function(err, ks) {
          keystore = ks;
          setWeb3Provider(global_keystore);
          newAddresses(keystore, password);
        });
      } else {
        newAddresses(keystore, password);
      }
    },
    getAccounts: () => {
      global_keystore.getAddresses();
    }
  }
};