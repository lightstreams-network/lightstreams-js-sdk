"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var Signing = require('../lightwallet/signing');

var PublicResolver = require('@ensdomains/resolver/build/contracts/PublicResolver.json');

var namehash = require('eth-ens-namehash');

module.exports.lightwallet = function (web3, ksVault, pwDerivedKey) {
  return {
    deploy: function deploy(_ref) {
      var from = _ref.from,
          ensAddress = _ref.ensAddress;
      return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
        from: from,
        bytecode: PublicResolver.bytecode,
        abi: PublicResolver.abi,
        params: [ensAddress]
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
    deploy: function deploy(_ref2) {
      var from = _ref2.from,
          ensAddress = _ref2.ensAddress;
      return Web3.deployContract(web3, {
        from: from,
        abi: PublicResolver.abi,
        bytecode: PublicResolver.bytecode,
        params: [ensAddress]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    },
    setAddr: function setAddr(contractAddress, _ref3) {
      var from = _ref3.from,
          node = _ref3.node,
          address = _ref3.address,
          owner = _ref3.owner;
      return Web3.contractSendTx(web3, contractAddress, {
        from: from || owner,
        abi: PublicResolver.abi,
        method: 'setAddr',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node), //node
        address]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    }
  };
};