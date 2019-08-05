/**
 * User: ggarrido
 * Date: 5/08/19 17:13
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('./service');
const Wallet = require('./wallet');
const Tx = require('./transaction');

module.exports = (provider, options = {}) => {
  const web3 = Web3(provider, options);

  return {
    createWallet: () => {
      Wallet.create();
    },
    sendTx: (from, password) => {
      Tx.sentTx(web3, { from, password })
    }
  }
};