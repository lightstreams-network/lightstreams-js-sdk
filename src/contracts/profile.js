/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const contract = require('../../build/contracts/Profile.json');

module.exports.lightwallet = (web3, ksVault, pwDerivedKey) => ({
  deploy: ({ from, owner, recoveryAccount }) => {
    return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
      from,
      bytecode: contract.bytecode,
      abi: contract.abi,
      params: [owner, recoveryAccount || '0x0000000000000000000000000000000000000000']
    }).then(rawSignedTx => {
      return Web3.sendRawTransaction(web3, rawSignedTx);
    }).then(txHash => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
});

module.exports.web3 = (web3) => ({
  deploy: ({ owner, recoveryAccount }) => {
    return Web3.deployContract(web3, {
      abi: contract.abi,
      bytecode: contract.bytecode,
      params: [owner, recoveryAccount || '0x0000000000000000000000000000000000000000'],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    })
  }
});