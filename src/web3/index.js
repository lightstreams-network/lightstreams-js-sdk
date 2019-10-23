/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('web3');
const net = require('net');

const { fetchTxReceipt, calculateEstimatedGas, isLatest, FailedTxError } = require('./helpers');

const defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000,
};

module.exports.newEngine = (provider, options = {}) => {
  if(typeof provider === 'string') {
    const Web3Provider = require('../web3-provider'); // @ISSUE when imported top due to recursive dependency
    provider = Web3Provider({
      ...options,
      rpcUrl: provider
    });
  }

  return new Web3(provider || defaultCfg.provider, net, {
    defaultGasPrice: options.gasPrice || defaultCfg.gasPrice,
  });
};

const getTxReceipt = module.exports.getTxReceipt = (web3, { txHash, timeoutInSec }) => {
  return new Promise((resolve, reject) => {
    if(!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    fetchTxReceipt(web3, txHash, (new Date()).getTime() + (timeoutInSec || 15) * 1000).then(receipt => {
      if (!receipt) reject(new Error(`Cannot fetch tx receipt ${txHash}`));
      else resolve(receipt);
    }).catch(reject);
  });
};

module.exports.sendRawTransaction = (web3, rawSignedTx) => {
  return new Promise((resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    web3.eth.sendSignedTransaction(rawSignedTx, (err, txHash) => {
      if (err) reject(err);
      getTxReceipt(web3, { txHash }).then(txReceipt => {
        if (!txReceipt.status) reject(FailedTxError(txReceipt));
        else resolve(txReceipt);
      }).catch(reject);
    });
  });
};

module.exports.sendTransaction = (web3, { from, to, valueInPht }) => {
  return new Promise((resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(valueInPht, "ether"),
    }).on('transactionHash', (txHash) => {
      getTxReceipt(web3, { txHash }).then(txReceipt => {
        if (!txReceipt.status) reject(FailedTxError(txReceipt));
        else resolve(txReceipt);
      }).catch(reject);
    }).on('error', reject);
  });
};

module.exports.contractCall = (web3, { to: contractAddr, abi, from, method, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    try {
      const contract = new web3.eth.Contract(abi, contractAddr);
      if (typeof contract.methods[method] !== 'function') {
        throw new Error(`Method ${method} is not available`);
      }

      const result = await contract.methods[method](...(params || [])).call({ from });
      resolve(result);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.contractSendTx = (web3, { to: contractAddr, abi, from, method, params, value, gas, useGSN }) => {
  return new Promise(async (resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    try {
      const contract = new web3.eth.Contract(abi, contractAddr);
      if (typeof contract.methods[method] !== 'function') {
        throw new Error(`Method ${method} is not available`);
      }

      const sendTx = contract.methods[method](...(params || []));
      const estimatedGas = gas || await calculateEstimatedGas(sendTx, { from, value });

      sendTx.send({
        from,
        value,
        useGSN: useGSN || false,
        gas: estimatedGas
      }).on('transactionHash', (txHash) => {
        console.log(`Tx executed: `, txHash)
      }).on('receipt', (txReceipt) => {
        if (!txReceipt.status) reject(txReceipt);
        else resolve(txReceipt);
      }).on('error', reject);

    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.deployContract = (web3, { from, abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    try {
      const contract = new web3.eth.Contract(abi);
      const contractDeploy = contract.deploy({ data: bytecode, arguments: params || [] });
      const estimatedGas = await calculateEstimatedGas(contractDeploy, { from });

      contractDeploy.send({
        from,
        gas: estimatedGas
      }).on('transactionHash', (txHash) => {
        console.log(`Tx executed: `, txHash)
      }).on('receipt', (txReceipt) => {
        if (!txReceipt.status) reject(FailedTxError(txReceipt));
        else resolve(txReceipt);
      }).on('error', reject);

    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.getBalance = (web3, { address }) => {
  return new Promise(async (resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    try {
      const balance = await web3.eth.getBalance(address);
      resolve(balance);
    } catch ( err ) {
      reject(err)
    }
  })
};

module.exports.networkVersion = (web3) => {
  return new Promise((resolve, reject) => {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));

    web3.eth.net.getId((err, netId) => {
      if (err) reject(err);
      resolve(netId);
    })
  })
};

module.exports.keystore = require('./addon/keystore');

module.exports.utils = require('./addon/utils');

module.exports.validator = require('./addon/validator');

module.exports.v0_20 = require('./addon/v0_20');
