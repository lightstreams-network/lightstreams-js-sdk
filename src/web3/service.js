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

let web3;

module.exports = async ({ provider, gasPrice } = {}) => {
  if (typeof web3 === 'undefined') {
    try {
      web3 = new Web3(provider || defaultCfg.provider, net, {
        defaultGasPrice: gasPrice || defaultCfg.gasPrice,
      });
    } catch ( err ) {
      console.error(err);
      return null
    }
  }

  return web3;
};

module.exports.web3SendTx = (web3, { from, password }, txCall, options = {}) => {
  return new Promise((resolve, reject) => {
    web3.eth.personal.unlockAccount(from, password, 100).then(() => {
      txCall().send(options)
        .on('transactionHash', (transactionHash) => {
          console.log(`Transaction Executed: ${transactionHash}`);
        })
        .on('confirmation', (confirmationNumber, txReceipt) => {
          web3.eth.personal.lockAccount(cfg.from);
          if (typeof txReceipt.status !== 'undefined') {
            if (txReceipt.status === true || txReceipt.status === '0x1') {
              console.log('Transaction succeeded!');
              resolve(txReceipt);
            } else {
              console.error('Transaction failed!');
              reject(new Error('Transaction failed'));
            }
          } else {
            resolve(txReceipt);
          }
        })
        .on('error', (err) => {
          web3.eth.personal.lockAccount(from);
          console.error(err);
          reject(err);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  });
};