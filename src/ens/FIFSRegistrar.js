/**
 * User: ggarrido
 * Date: 27/08/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const Signing = require('../lightwallet/signing');
const ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');

module.exports.deployLightWallet = (web3, ksVault, pwDerivedKey, { from, tld }) => {
  return Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, {
    from,
    bytecode: ENS.bytecode,
    abi: ENS.abi
  }).then(rawSignedTx => {
    return Web3.sendRawTransaction(web3, rawSignedTx);
  }).then(txHash => {
    return Web3.getTxReceipt(web3, txHash);
  })
};