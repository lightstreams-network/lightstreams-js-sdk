/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');
const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

module.exports.lightwallet = (web3, ksVault, pwDerivedKey) => ({
  deploy: ({ from }) => {
    return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
      from,
      bytecode: ENS.bytecode,
      abi: ENS.abi
    }).then(rawSignedTx => {
      return Web3.sendRawTransaction(web3, rawSignedTx);
    }).then(txHash => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
  registerNode: (contractAddress, { from, rootNode, subNode, owner }) => {
    if (!rootNode || !subNode) {
      throw new Error(`Missing required value`);
    }
    return Signing.signContractMethodTx(web3, ksVault, pwDerivedKey, {
      from,
      method: 'setSubnodeOwner',
      params: [namehash.hash(rootNode), utils.sha3(subNode), owner || from],
      abi: ENS.abi,
      address: contractAddress,
    }).then(rawSignedTx => {
      return Web3.sendRawTransaction(web3, rawSignedTx);
    }).then(txHash => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
  setResolver: (contractAddress, { from, resolverAddress, node }) => {
    return Signing.signContractMethodTx(web3, ksVault, pwDerivedKey, {
      from,
      method: 'setResolver',
      params: [namehash.hash(node), resolverAddress],
      abi: ENS.abi,
      address: contractAddress,
    }).then(rawSignedTx => {
      return Web3.sendRawTransaction(web3, rawSignedTx);
    }).then(txHash => {
      return Web3.getTxReceipt(web3, txHash);
    })
  }
});

module.exports.web3 = (web3) => ({
  deploy: ({ from }) => {
    return Web3.deployContract(web3, {
      from,
      abi: ENS.abi,
      bytecode: ENS.bytecode,
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    })
  },
  registerNode: (contractAddress, { from, parentNode, node, owner }) => {
    if(!parentNode || !node) {
      throw new Error(`Missing required value`);
    }

    return Web3.contractSendTx(web3, contractAddress, {
      from: from || owner,
      abi: ENS.abi,
      method: 'setSubnodeOwner',
      params: [
        parentNode.indexOf('0x') === 0 ? parentNode : namehash.hash(parentNode), // domain
        node.indexOf('0x') === 0 ? node : utils.sha3(node), // subdomain
        owner || from
      ],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
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
      return Web3.getTxReceipt(web3, txHash);
    });
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
