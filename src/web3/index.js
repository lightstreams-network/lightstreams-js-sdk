/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */


const latest = require('./latest');
const v0_20 = require('./v0_20');

const isLatest = (web3) => {
  return typeof web3.version === 'string' && web3.version.indexOf('1.') === 0;
};

const isV0_20 = (web3) => {
  return typeof web3.version === 'object' && web3.version.api.indexOf('0.20') === 0;
};


module.exports.initialize = (provider, options = {}) => {
  return latest.initialize(provider, options);
};

module.exports.networkVersion = (web3) => {
  if (isLatest(web3)) {
    return latest.networkVersion(web3)
  } else if (isV0_20(web3)) {
    return v0_20.networkVersion(web3)
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.lockAccount = (web3, { address }) => {
  return new Promise((resolve, reject) => {
    web3.eth.personal.lockAccount(address)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.unlockAccount = (web3, { address, password, duration }) => {
  return new Promise((resolve, reject) => {
    web3.eth.personal.unlockAccount(address, password, duration || 1000)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.importAccount = (web3, { encodedJson }) => {
  if(typeof web3.currentProvider.importAccount !== 'function') {
    throw new Error(`Not supported method`)
  }

  web3.currentProvider.importAccount(encodedJson);
};

module.exports.getTxReceipt = (web3, payload) => {
  if (isLatest(web3)) {
    return latest.getTxReceipt(web3, payload);
  } else if (isV0_20(web3)) {
    return v0_20.getTxReceipt(web3, payload)
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.getBalance = (web3, payload) => {
  if (isLatest(web3)) {
    return latest.getBalance(web3, payload)
  } else if (isV0_20(web3)) {
    return v0_20.getBalance(web3, payload)
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.sendRawTransaction = (web3, rawSignedTx) => {
  if (isLatest(web3)) {
    return latest.sendRawTransaction(web3, rawSignedTx);
  } else if (isV0_20(web3)) {
    return v0_20.sendRawTransaction(web3, rawSignedTx)
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.deployContract = (web3, payload) => {
  if (isLatest(web3)) {
    return latest.deployContract(web3, payload)
  } else if (isV0_20(web3)) {
    return v0_20.deployContract(web3, payload)
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.contractCall = (web3, contractAddress, payload) => {
  if (isLatest(web3)) {
    return latest.contractCall(web3, contractAddress, payload)
  } else if (isV0_20(web3)) {
    return v0_20.contractCall(web3, contractAddress, payload)
  } else {
    throw new Error('Not supported method');
  }
};

module.exports.contractSendTx = (web3, contractAddress, payload) => {
  if (isLatest(web3)) {
    return latest.contractSendTx(web3, contractAddress, payload)
  } else if (isV0_20(web3)) {
    return v0_20.contractSendTx(web3, contractAddress, payload)
  } else {
    throw new Error('Not supported method');
  }
};