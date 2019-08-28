"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var Signing = require('../lightwallet/signing');

var PublicResolver = require('@ensdomains/resolver/build/contracts/PublicResolver.json');

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
    }
  };
};