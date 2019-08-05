/**
 * User: ggarrido
 * Date: 5/08/19 17:14
 * Copyright 2019 (c) Lightstreams, Granada
 */

module.exports.sentTx = (web3, { from, password }, txCall, options = {}) => {
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