"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var FIFSRegistrar = require('@ensdomains/ens/build/contracts/FIFSRegistrar.json');

var namehash = require('eth-ens-namehash');

module.exports = function (web3) {
  return {
    deploy: function deploy(_ref) {
      var from = _ref.from,
          ensAddress = _ref.ensAddress,
          rootNode = _ref.rootNode;
      return Web3.deployContract(web3, {
        from: from,
        abi: FIFSRegistrar.abi,
        bytecode: FIFSRegistrar.bytecode,
        params: [ensAddress, namehash.hash(rootNode)]
      }).then(function (txHash) {
        return Web3.getTxReceipt(web3, txHash);
      });
    }
  };
};