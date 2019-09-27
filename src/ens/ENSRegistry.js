/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');
const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

module.exports = (web3) => ({
  // bytecode MUST be an optional argument because it will depends on compiler version
  deploy: ({ from, bytecode }) => {
    return Web3.deployContract(web3, {
      from,
      abi: ENS.abi,
      bytecode: bytecode || ENS.bytecode,
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, { txHash });
    })
  },
  registerNode: (contractAddress, { from, parentNode, subnode, owner }) => {
    if(!parentNode || !subnode) {
      throw new Error(`Missing required value`);
    }

    return Web3.contractSendTx(web3, contractAddress, {
      from: from || owner,
      abi: ENS.abi,
      method: 'setSubnodeOwner',
      params: [
        parentNode.indexOf('0x') === 0 ? parentNode : namehash.hash(parentNode), // domain
        subnode.indexOf('0x') === 0 ? subnode : utils.sha3(subnode), // subdomain
        owner || from
      ],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, { txHash });
    });
  },
  setResolver: (contractAddress, { from, resolverAddress, node, owner }) => {
    return Web3.contractSendTx(web3, contractAddress, {
      from: from || owner,
      abi: ENS.abi,
      method: 'setResolver',
      params: [
        node.indexOf('0x') === 0 ? node : namehash.hash(node), //node
        resolverAddress
      ],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, { txHash });
    });
  },
  owner: (contractAddress, { node }) => {
    return Web3.contractCall(web3, contractAddress, {
      abi: ENS.abi,
      method: 'owner',
      params: [
        node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
      ]
    })
  },
  ttl: (contractAddress, { node }) => {
    return Web3.contractCall(web3, contractAddress, {
      abi: ENS.abi,
      method: 'ttl',
      params: [
        node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
      ]
    })
  },
  resolver: (contractAddress, { node }) => {
    return Web3.contractCall(web3, contractAddress, {
      abi: ENS.abi,
      method: 'resolver',
      params: [
        node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
      ]
    })
  }
});


