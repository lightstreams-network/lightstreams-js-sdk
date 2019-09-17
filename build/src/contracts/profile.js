"use strict";

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var contract = require('../../build/contracts/Profile.json');

module.exports.deploy = function (web3, _ref) {
  var owner = _ref.owner,
      from = _ref.from,
      recoveryAccount = _ref.recoveryAccount;

  if (!owner && !from) {
    throw new Error("Missing contract owner");
  }

  return Web3.deployContract(web3, {
    from: from || owner,
    abi: contract.abi,
    bytecode: contract.bytecode,
    params: [owner || from, recoveryAccount || '0x0000000000000000000000000000000000000000']
  }).then(function (txHash) {
    return Web3.getTxReceipt(web3, {
      txHash: txHash
    });
  });
};

module.exports.recover = function (web3, cont1ractAddr, _ref2) {
  var from = _ref2.from,
      newOwner = _ref2.newOwner;

  if (!newOwner && !from) {
    throw new Error("Missing mandatory call params");
  }

  return Web3.contractSendTx(web3, contractAddr, {
    from: from,
    method: 'recover',
    abi: contract.abi,
    params: [newOwner]
  }).then(function (txHash) {
    return Web3.getTxReceipt(web3, {
      txHash: txHash
    });
  });
};