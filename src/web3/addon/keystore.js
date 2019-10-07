/**
 * User: ggarrido
 * Date: 7/10/19 17:31
 * Copyright 2019 (c) Lightstreams, Granada
 */


module.exports.getAccounts = (web3) => {
  return new Promise((resolve) => {
    web3.eth.getAccounts().then(addrs => {
      resolve(addrs.map(addr => addr.toLowerCase()));
    })
  });
};

module.exports.getPrivateKey = (web3, { address }) => {
  return new Promise((resolve, reject) => {
    if (typeof web3.currentProvider._getAccount !== 'function') {
      reject(new Error(`Not supported method`))
    }

    if(web3.currentProvider.isAccountLocked(address)) {
      reject(new Error(`Account is locked`));
    }

    const privKey = web3.currentProvider._getAccount(address).privateKey();
    resolve(privKey);
  });
};

module.exports.lockAccount = (web3, { address }) => {
  return new Promise((resolve, reject) => {
    if (typeof web3.eth.personal.lockAccount !== 'function') {
      reject(new Error(`Not supported method`))
    }

    web3.eth.personal.lockAccount(address)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.unlockAccount = (web3, { address, password, duration }) => {
  return new Promise((resolve, reject) => {
    if (typeof web3.eth.personal.unlockAccount !== 'function') {
      reject(new Error(`Not supported method`))
    }

    web3.eth.personal.unlockAccount(address, password, duration || 1000)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.importAccount = (web3, { encryptedJson, decryptedWallet }) => {
  if (typeof web3.currentProvider.importAccount !== 'function') {
    throw new Error(`Not supported method`)
  }

  web3.currentProvider.importAccount(encryptedJson, decryptedWallet);
};

module.exports.isAccountLocked = (web3, { address }) => {
  if (typeof web3.currentProvider.isAccountLocked !== 'function') {
    throw new Error(`Not supported method`)
  }

  return web3.currentProvider.isAccountLocked(address);
};