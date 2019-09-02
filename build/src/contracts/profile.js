"use strict";

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var contract = require('../../build/contracts/Profile.json');

module.exports = function (web3) {
  return {
    deploy: function deploy(_ref) {
      var owner = _ref.owner,
          recoveryAccount = _ref.recoveryAccount;
      return Web3.deployContract(web3, {
        abi: contract.abi,
        bytecode: contract.bytecode,
        params: [owner, recoveryAccount || '0x0000000000000000000000000000000000000000']
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, {
          txHash: txHash
        });
      });
    }
  };
};