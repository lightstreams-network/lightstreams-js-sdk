"use strict";

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var Signing = require('../lightwallet/signing');

var contract = require('../../build/contracts/Profile.json');

module.exports.lightwallet = function (web3, ksVault, pwDerivedKey) {
  return {
    deploy: function deploy(_ref) {
      var from = _ref.from,
          owner = _ref.owner,
          recoveryAccount = _ref.recoveryAccount;
      return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
        from: from,
        bytecode: contract.bytecode,
        abi: contract.abi,
        params: [owner, recoveryAccount || '0x0000000000000000000000000000000000000000']
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
      var owner = _ref2.owner,
          recoveryAccount = _ref2.recoveryAccount;
      return Web3.deployContract(web3, {
        abi: contract.abi,
        bytecode: contract.bytecode,
        params: [owner, recoveryAccount || '0x0000000000000000000000000000000000000000']
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    }
  };
};