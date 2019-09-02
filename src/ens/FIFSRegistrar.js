/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const FIFSRegistrar = require('@ensdomains/ens/build/contracts/FIFSRegistrar.json');
const namehash = require('eth-ens-namehash');

module.exports = (web3) => ({
  deploy: ({ from, ensAddress, rootNode }) => {
    return Web3.deployContract(web3, {
      from,
      abi: FIFSRegistrar.abi,
      bytecode: FIFSRegistrar.bytecode,
      params: [ensAddress, namehash.hash(rootNode)]
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, { txHash });
    })
  }
});