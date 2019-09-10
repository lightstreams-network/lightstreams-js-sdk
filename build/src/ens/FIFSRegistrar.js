"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var FIFSRegistrar = require('../../build/contracts/FIFSRegistrar.json');

var namehash = require('eth-ens-namehash');

module.exports = function (web3) {
  return {
    // bytecode MUST be an optional argument because it will depends on compiler version
    deploy: function deploy(_ref) {
      var from = _ref.from,
          bytecode = _ref.bytecode,
          ensAddress = _ref.ensAddress,
          rootNode = _ref.rootNode;
      return Web3.deployContract(web3, {
        from: from,
        abi: FIFSRegistrar.abi,
        bytecode: bytecode || FIFSRegistrar.bytecode,
        params: [ensAddress, namehash.hash(rootNode)]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, {
          txHash: txHash
        });
      });
    }
  };
};