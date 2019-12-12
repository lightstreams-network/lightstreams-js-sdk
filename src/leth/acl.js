/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 11/12/19 10:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

const aclSc = require('../../build/contracts/ACL.json');

module.exports.create = async (web3, { from, owner, isPublic = false }) => {
  return await Web3Wrapper.deployContract(
    web3,
    {
      from,
      useGSN: false,
      abi: aclSc.abi,
      bytecode: aclSc.bytecode,
      params: [owner, isPublic]
    }
  );
};

module.exports.grantRead = async (web3, { from, contractAddr, account }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("account", account);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from,
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'grantRead',
      params: [account]
    }
  );
};

module.exports.grantWrite = async (web3, { from, contractAddr, account }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("account", account);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from,
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'grantWrite',
      params: [account]
    }
  );
};

module.exports.grantAdmin = async (web3, { from, contractAddr, account }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("account", account);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from,
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'grantAdmin',
      params: [account]
    }
  );
};

module.exports.revokeAccess = async (web3, { from, contractAddr, account }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("account", account);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from,
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'revokeAccess',
      params: [account]
    }
  );
};

module.exports.grantPublicAccess = async (web3, { from, contractAddr }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from,
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'grantPublicAccess',
      params: []
    }
  );
};

module.exports.revokePublicAccess = async (web3, { from, contractAddr }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from,
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'revokePublicAccess',
      params: []
    }
  );
};

module.exports.hasRead = async (web3, { contractAddr, account }) => {
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("account", account);

  return await Web3Wrapper.contractCall(
    web3,
    {
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'hasRead',
      params: [account]
    }
  );
};

module.exports.hasAdmin = async (web3, { contractAddr, account }) => {
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("account", account);

  return await Web3Wrapper.contractCall(
    web3,
    {
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'hasAdmin',
      params: [account]
    }
  );
};

module.exports.getOwner = async (web3, { contractAddr }) => {
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return await Web3Wrapper.contractCall(
    web3,
    {
      to: contractAddr,
      useGSN: false,
      abi: aclSc.abi,
      method: 'getOwner',
      params: []
    }
  );
};
