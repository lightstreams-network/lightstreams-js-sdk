"use strict";

/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var PublicResolver = require('@ensdomains/resolver/build/contracts/PublicResolver.json');

var namehash = require('eth-ens-namehash');

module.exports = function (web3) {
  return {
    // bytecode MUST be an optional argument because it will depends on compiler version
    deploy: function deploy(_ref) {
      var from = _ref.from,
          ensAddress = _ref.ensAddress,
          bytecode = _ref.bytecode;
      return Web3.deployContract(web3, {
        from: from,
        abi: PublicResolver.abi,
        bytecode: bytecode || PublicResolver.bytecode,
        params: [ensAddress]
      });
    },
    setAddr: function setAddr(contractAddress, _ref2) {
      var from = _ref2.from,
          node = _ref2.node,
          address = _ref2.address,
          owner = _ref2.owner;
      return Web3.contractSendTx(web3, contractAddress, {
        from: from || owner,
        abi: PublicResolver.abi,
        method: 'setAddr',
        params: [node.indexOf('0x') === 0 ? node : namehash.hash(node), //node
        address]
      });
    }
  };
};