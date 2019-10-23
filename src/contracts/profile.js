/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
const Web3Wrapper = require('../web3');
const { fundRecipient, isRelayHubDeployed } = require('../gsn');

const factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');
const profileScJSON = require('../../build/contracts/GSNProfile.json');

module.exports.initializeProfileFactory = async (web3, { contractAddr, relayHub, from, factoryFundingInPht, faucetFundingInPht }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("relayHub", relayHub);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  if (isNaN(parseFloat(factoryFundingInPht))) {
    throw new Error(`Invalid "factoryFundingInPht" value ${factoryFundingInPht}. Expected a float number`);
  }

  if (isNaN(parseFloat(faucetFundingInPht))) {
    throw new Error(`Invalid "profileFundingInPht" value ${faucetFundingInPht}. Expected a float number`);
  }

  const isRelayHub = await isRelayHubDeployed(web3, { relayHub });
  if(!isRelayHub) {
    throw new Error(`RelayHub is not found at ${relayHub}`);
  }

  // Step 2: Initialize gsn feature within profile factory contract
  const txReceipt = await Web3Wrapper.contractSendTx(web3, {
    to: contractAddr,
    from,
    abi: factoryScJSON.abi,
    method: 'initialize',
    params: [relayHub]
  });
  if (!txReceipt.status) {
    throw new Error(`ProfileFactory initialization failed`);
  } else {
    console.log(`Activated GSN for ProfileFactory instance for RelayHub ${relayHub}...`);
  }

  // Step 3: Profile factory is funded via RelayHub
  await fundRecipient(web3, {
    from,
    recipient: contractAddr,
    relayHub: relayHub,
    amountInPht: factoryFundingInPht
  });

  console.log(`Recipient ${contractAddr} is sponsored by relayHub with ${factoryFundingInPht} PHTs...`);

  // Step 4: Top up factory contract to fund new profile deployments
  await Web3Wrapper.sendTransaction(web3, { from, to: contractAddr, valueInPht: faucetFundingInPht });
  console.log(`Topped up ProfileFactory with ${faucetFundingInPht} PHTs to fund new profile creations...`);

  return contractAddr;
};

module.exports.deployProfileByFactory = async (web3, { from, contractAddr, useGSN }) => {
  const txReceipt = await Web3Wrapper.contractSendTx(web3, {
    to: contractAddr,
    from,
    useGSN: useGSN || false,
    abi: factoryScJSON.abi,
    method: 'newProfile',
    params: [from]
  });

  return txReceipt.events['NewProfile'].returnValues['addr'];
};

module.exports.addOwner = async (web3, { from, contractAddr, useGSN, ownerAddr }) => {
  return Web3Wrapper.contractSendTx(web3, {
    to: contractAddr,
    from,
    useGSN: useGSN || false,
    abi: profileScJSON.abi,
    method: 'addOwner',
    params: [ownerAddr]
  });
};

module.exports.recover = async (web3, contractAddr, { from, newOwner, useGSN }) => {
  if (!newOwner && !from) {
    throw new Error(`Missing mandatory call params`);
  }

  return Web3Wrapper.contractSendTx(web3, {
    to: contractAddr,
    from: from,
    useGSN: useGSN || false,
    method: 'recover',
    abi: profileScJSON.abi,
    params: [newOwner],
  })
};
