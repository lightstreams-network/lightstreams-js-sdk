/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');
const namehash = require('eth-ens-namehash');


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
      params: [namehash.hash(rootNode), namehash.hash(subNode), owner || from],
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
  registerNode: (contractAddress, { from, rootNode, subNode, owner }) => {
    if(!rootNode || !subNode) {
      throw new Error(`Missing required value`);
    }
    return Web3.contractSendTx(web3, contractAddress, {
      from,
      abi: ENS.abi,
      method: 'setSubnodeOwner',
      params: [namehash.hash(rootNode), namehash.hash(subNode), owner || from],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    });
  },
  setResolver: (contractAddress, { from, resolverAddress, node }) => {
    return Web3.contractSendTx(web3, contractAddress, {
      from,
      abi: ENS.abi,
      method: 'setResolver',
      params: [namehash.hash(node), resolverAddress],
    }).then((txHash) => {
      return Web3.getTxReceipt(web3, txHash);
    });
  }
});
