/**
 * User: ggarrido
 * Date: 5/08/19 15:45
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Web3 = require('web3');
const net = require('net');

const defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000,
};

const waitFor = (waitInSeconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

const fetchTxReceipt = async (web3, txHash, expiredAt) => {
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  if (!receipt && (new Date()).getTime() < expiredAt) {
    await waitFor(0.5);
    return fetchTxReceipt(web3, txHash, expiredAt);
  }

  return receipt
};


module.exports = ({
  initialize: async (provider, options = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const web3 = new Web3(provider || defaultCfg.provider, net, {
          defaultGasPrice: options.gasPrice || defaultCfg.gasPrice,
        });
        resolve(web3);
      } catch(err) {
        reject(err);
      }
    });
  },
  getTxReceipt: (web3, txHash, timeoutInSec = 30) => {
    return new Promise((resolve, reject) => {
      if (typeof web3 === 'undefined') {
        reject('Web3 was not initialized');
      }

      fetchTxReceipt(web3, txHash, (new Date()).getTime() + timeoutInSec*1000).then(receipt => {
        if(!receipt) {
          reject()
        }
        resolve(receipt);
      })
    });
  },
  getBalance: (web3, address) => {
    return new Promise(async (resolve, reject) => {
      if (typeof web3 === 'undefined') {
        reject('Web3 was not initialized');
      }

      try {
        const balance = await web3.eth.getBalance(address);
        resolve(balance);
      } catch(err) {
        reject(err)
      }
    })
  },
  sendRawTransaction: (web3, rawSignedTx) => {
    return new Promise((resolve, reject) => {
      if (typeof web3 === 'undefined') {
        reject('Web3 was not initialized');
      }

      web3.eth.sendSignedTransaction(rawSignedTx, (err, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  },
  contractCall: (web3, { abi, address, method, params }) => {
    return new Promise(async (resolve, reject) => {
      const contract = new web3.eth.Contract(abi, address);
      try {
        const result = await contract.methods[method](...params).call({
          from: address
        });
        resolve(result);
      } catch(err) {
        reject(err);
      }
    });
  }
});