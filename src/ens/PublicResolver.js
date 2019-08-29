/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const PublicResolver = require('@ensdomains/resolver/build/contracts/PublicResolver.json');
const namehash = require('eth-ens-namehash');

module.exports.lightwallet = (web3, ksVault, pwDerivedKey) => ({
  deploy: ({ from, ensAddress }) => {
    return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
      from,
      bytecode: PublicResolver.bytecode,
      abi: PublicResolver.abi,
      params: [ensAddress]
    }).then(rawSignedTx => {
      return Web3.sendRawTransaction(web3, rawSignedTx);
    }).then(txHash => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
});

module.exports.web3 = (web3) => ({
  deploy: ({ from, ensAddress }) => {
    return Web3.deployContract(web3, {
      from,
      abi: PublicResolver.abi,
      bytecode: PublicResolver.bytecode,
      params: [ensAddress]
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
  setAddr: (contractAddress, { from, node, address, owner }) => {
    return Web3.contractSendTx(web3, contractAddress, {
      from: from || owner,
      abi: PublicResolver.abi,
      method: 'setAddr',
      params: [
        node.indexOf('0x') === 0 ? node : namehash.hash(node), //node
        address
      ],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    });
  }
});