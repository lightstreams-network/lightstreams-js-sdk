/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const PublicResolver = require('@ensdomains/resolver/build/contracts/PublicResolver.json');
const namehash = require('eth-ens-namehash');

module.exports = (web3) => ({
  // bytecode MUST be an optional argument because it will depends on compiler version
  deploy: ({ from, ensAddress, bytecode }) => {
    return Web3.deployContract(web3, {
      from,
      abi: PublicResolver.abi,
      bytecode: bytecode || PublicResolver.bytecode,
      params: [ensAddress]
    })
  },
  setAddr: (contractAddress, { from, node, address, owner }) => {
    return Web3.contractSendTx(web3, {
      to: contractAddress,
      from: from || owner,
      abi: PublicResolver.abi,
      method: 'setAddr',
      params: [
        node.indexOf('0x') === 0 ? node : namehash.hash(node), //node
        address
      ],
    })
  }
});
