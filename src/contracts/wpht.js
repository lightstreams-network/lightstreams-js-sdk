/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 21/11/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');
const Debug = require('debug');

const wphtSc = require('../../build/contracts/WPHT.json');
const fundingPoolSc = require('../../build/contracts/FundingPool.json');
const logger = Debug('ls-sdk:contract:wpht');

module.exports.deployContract = (web3, {from}) => {
  return Web3Wrapper.deployContract(web3, {
    from,
    abi: wphtSc.abi,
    bytecode: wphtSc.bytecode,
    params: []
  })
};

module.exports.getWPHTBalanceOf = async (web3, { wphtAddr, accountAddr }) => {
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
  Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);

  const balance = await Web3Wrapper.contractCall(
    web3,
    {
      to: wphtAddr,
      useGSN: false,
      method: 'balanceOf',
      abi: wphtSc.abi,
      params: [accountAddr],
    }
  );

  return Web3Wrapper.utils.toBN(balance);
};

module.exports.deposit = async (web3, { from, wphtAddr, amountInPht }) => {
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);

  return await Web3Wrapper.contractSendTx(web3, {
      from,
      to: wphtAddr,
      method: 'deposit',
      abi: wphtSc.abi,
      value: Web3Wrapper.utils.toWei(amountInPht),
    }
  );
};

module.exports.deployFundingPool = async(web3, { from, wphtAddr, owner }) => {
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);

  return await Web3Wrapper.deployContract(web3, {
    from,
    abi: fundingPoolSc.abi,
    bytecode: fundingPoolSc.bytecode,
    params: [wphtAddr, owner || from]
  });
};
