/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 21/11/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

const fundingPoolSc = require('../../build/contracts/FundingPool.json');

module.exports.allocateFunds = async (web3, {contractAddr, artistTokenAddr, beneficiary, amount, from}) => {
  Web3Wrapper.validator.validateAddress('contractAddr', contractAddr);
  Web3Wrapper.validator.validateAddress('artistTokenAddr', artistTokenAddr);
  Web3Wrapper.validator.validateAddress('beneficiary', beneficiary);
  Web3Wrapper.validator.validateWeiBn('amount', amount);

  return await Web3Wrapper.contractSendTx(
      web3, {
        to: contractAddr,
        from,
        useGSN: false,
        method: 'allocateFunds',
        abi: fundingPoolSc.abi,
        params: [artistTokenAddr, beneficiary, amount.toString()],
      },
  );
};
