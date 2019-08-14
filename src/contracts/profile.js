/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const MetaMask = require('../metamask');
const contract = require('../../build/contracts/Profile.json');

module.exports.deployProfileLightwallet = (web3, ksVault, pwDerivedKey, { from }) => {
  return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
    from,
    bytecode: contract.bytecode
  }).then(rawSignedTx => {
    return Web3.sendRawTransaction(web3, rawSignedTx);
  }).then(txHash => {
    return Web3.getTxReceipt(web3, txHash);
  })
};

module.exports.deployProfileMetaMask = (web3) => {
  return Web3.deployContract(MetaMask.web3(), {
    abi: contract.abi,
    bytecode: contract.bytecode,
    params: [],
  }).then((txHash) => {
    return Web3.getTxReceipt(web3, txHash);
  })
};