"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var ENS = require('../../build/contracts/ENSRegistry.json');

var namehash = require('eth-ens-namehash');

var utils = require('web3-utils');

module.exports = function (web3) {
  return {
    // bytecode MUST be an optional argument because it will depends on compiler version
    deploy: function deploy(_ref) {
      var from = _ref.from,
          bytecode = _ref.bytecode;
      return Web3.deployContract(web3, {
        from: from,
        abi: ENS.abi,
        bytecode: bytecode || ENS.bytecode
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, {
          txHash: txHash
        });
      });
    },
    registerNode: function registerNode(contractAddress, _ref2) {
      var from = _ref2.from,
          parentNode = _ref2.parentNode,
          subnode = _ref2.subnode,
          owner = _ref2.owner;

      if (!parentNode || !subnode) {
        throw new Error("Missing required value");
      }

      return Web3.contractSendTx(web3, contractAddress, {
        from: from || owner,
        abi: ENS.abi,
        method: 'setSubnodeOwner',
        params: [parentNode.indexOf('0x') === 0 ? parentNode : namehash.hash(parentNode), // domain
        subnode.indexOf('0x') === 0 ? subnode : utils.sha3(subnode), // subdomain
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
    owner: function owner(contractAddress, _ref4) {
      var node = _ref4.node;
      return Web3.contractCall(web3, contractAddress, {
        abi: ENS.abi,
        method: 'owner',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
        ]
      });
    },
    ttl: function ttl(contractAddress, _ref5) {
      var node = _ref5.node;
      return Web3.contractCall(web3, contractAddress, {
        abi: ENS.abi,
        method: 'ttl',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
        ]
      });
    },
    resolver: function resolver(contractAddress, _ref6) {
      var node = _ref6.node;
      return Web3.contractCall(web3, contractAddress, {
        abi: ENS.abi,
        method: 'resolver',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node) // node
        ]
      });
    }
  };
};