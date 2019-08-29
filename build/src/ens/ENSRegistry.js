"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var Signing = require('../lightwallet/signing');

var ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');

var namehash = require('eth-ens-namehash');

module.exports.lightwallet = function (web3, ksVault, pwDerivedKey) {
  return {
    deploy: function deploy(_ref) {
      var from = _ref.from;
      return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
        from: from,
        bytecode: ENS.bytecode,
        abi: ENS.abi
      }).then(function (rawSignedTx) {
        return Web3.sendRawTransaction(web3, rawSignedTx);
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    },
    registerNode: function registerNode(contractAddress, _ref2) {
      var from = _ref2.from,
          rootNode = _ref2.rootNode,
          subNode = _ref2.subNode,
          owner = _ref2.owner;

      if (!rootNode || !subNode) {
        throw new Error("Missing required value");
      }

      return Signing.signContractMethodTx(web3, ksVault, pwDerivedKey, {
        from: from,
        method: 'setSubnodeOwner',
        params: [namehash.hash(rootNode), namehash.hash(subNode), owner || from],
        abi: ENS.abi,
        address: contractAddress
      }).then(function (rawSignedTx) {
        return Web3.sendRawTransaction(web3, rawSignedTx);
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    },
    setResolver: function setResolver(contractAddress, _ref3) {
      var from = _ref3.from,
          resolverAddress = _ref3.resolverAddress,
          node = _ref3.node;
      return Signing.signContractMethodTx(web3, ksVault, pwDerivedKey, {
        from: from,
        method: 'setResolver',
        params: [namehash.hash(node), resolverAddress],
        abi: ENS.abi,
        address: contractAddress
      }).then(function (rawSignedTx) {
        return Web3.sendRawTransaction(web3, rawSignedTx);
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    }
  };
};

module.exports.web3 = function (web3) {
  return {
    deploy: function deploy(_ref4) {
      var from = _ref4.from;
      return Web3.deployContract(web3, {
        from: from,
        abi: ENS.abi,
        bytecode: ENS.bytecode
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    },
    registerNode: function registerNode(contractAddress, _ref5) {
      var from = _ref5.from,
          rootNode = _ref5.rootNode,
          subNode = _ref5.subNode,
          owner = _ref5.owner;

      if (!rootNode || !subNode) {
        throw new Error("Missing required value");
      }

      return Web3.contractSendTx(web3, contractAddress, {
        from: from,
        abi: ENS.abi,
        method: 'setSubnodeOwner',
        params: [namehash.hash(rootNode), namehash.hash(subNode), owner || from]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    },
    setResolver: function setResolver(contractAddress, _ref6) {
      var from = _ref6.from,
          resolverAddress = _ref6.resolverAddress,
          node = _ref6.node;
      return Web3.contractSendTx(web3, contractAddress, {
        from: from,
        abi: ENS.abi,
        method: 'setResolver',
        params: [namehash.hash(node), resolverAddress]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    }
  };
};