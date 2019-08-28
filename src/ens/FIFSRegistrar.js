/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const FIFSRegistrar = require('@ensdomains/ens/build/contracts/FIFSRegistrar.json');
const namehash = require('eth-ens-namehash');

module.exports.lightwallet = (web3, ksVault, pwDerivedKey) => ({
  deploy: ({ from, ensAddress, rootNode }) => {
    return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
      from,
      bytecode: FIFSRegistrar.bytecode,
      abi: FIFSRegistrar.abi,
      params: [ensAddress, namehash.hash(rootNode)]
    }).then(rawSignedTx => {
      return Web3.sendRawTransaction(web3, rawSignedTx);
    }).then(txHash => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
});

module.exports.web3 = (web3) => ({
  deploy: ({ ensAddress, rootNode }) => {
    return Web3.deployContract(web3, {
      abi: FIFSRegistrar.abi,
      bytecode: FIFSRegistrar.bytecode,
      params: [ensAddress, namehash.hash(rootNode)]
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    })
  }
});