"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');

var namehash = require('eth-ens-namehash');

var utils = require('web3-utils');

module.exports = function (web3) {
  return {
    deploy: function deploy(_ref) {
      var from = _ref.from;
      return Web3.deployContract(web3, {
        from: from,
        abi: ENS.abi,
        bytecode: ENS.bytecode
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, {
          txHash: txHash
        });
      });
    },
    registerNode: function registerNode(contractAddress, _ref2) {
      var from = _ref2.from,
          parentNode = _ref2.parentNode,
          node = _ref2.node,
          owner = _ref2.owner;

      if (!parentNode || !node) {
        throw new Error("Missing required value");
      }

      return Web3.contractSendTx(web3, contractAddress, {
        from: from || owner,
        abi: ENS.abi,
        method: 'setSubnodeOwner',
        params: [parentNode.indexOf('0x') === 0 ? parentNode : namehash.hash(parentNode), // domain
        node.indexOf('0x') === 0 ? node : utils.sha3(node), // subdomain
        owner || from]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, {
          txHash: txHash
        });
      });
    },
    setResolver: function setResolver(contractAddress, _ref3) {
      var from = _ref3.from,
          resolverAddress = _ref3.resolverAddress,
          node = _ref3.node,
          owner = _ref3.owner;
      return Web3.contractSendTx(web3, contractAddress, {
        from: from || owner,
        abi: ENS.abi,
        method: 'setResolver',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node), //node
        resolverAddress]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, {
          txHash: txHash
        });
      });
    },
    resolver: function resolver(contractAddress, _ref4) {
      var node = _ref4.node;
      return Web3.contractCall(web3, contractAddress, {
        abi: ENS.abi,
        method: 'resolver',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
        ]
      });
    }
  };
};