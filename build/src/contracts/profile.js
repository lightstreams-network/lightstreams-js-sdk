"use strict";

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var Signing = require('../lightwallet/signing');

var MetaMask = require('../metamask');

var contract = require('../../build/contracts/Profile.json');

module.exports.deployProfileLightwallet = function (web3, ksVault, pwDerivedKey, _ref) {
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
};

module.exports.deployProfileMetaMask = function (web3) {
  return Web3.deployContract(MetaMask.web3(), {
    abi: contract.abi,
    bytecode: contract.bytecode,
    params: []
  }).then(function (txHash) {
    return Web3.getTxReceipt(web3, txHash);
  });
};