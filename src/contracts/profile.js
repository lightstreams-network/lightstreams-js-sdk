/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const contract = require('../../build/contracts/Profile.json');

module.exports.deploy = (web3, { owner, from, recoveryAccount }) => {
  if(!owner && !from) {
    throw new Error(`Missing contract owner`);
  }

  return Web3.deployContract(web3, {
    from: from || owner,
    abi: contract.abi,
    bytecode: contract.bytecode,
    params: [owner || from, recoveryAccount || '0x0000000000000000000000000000000000000000'],
  }).then((txHash) => {
    return Web3.getTxReceipt(web3, { txHash });
  })
};