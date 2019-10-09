/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
const Web3 = require('../web3');
const { fundRecipient, isRelayHubDeployed } = require('../gsn');

const factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');
const profileScJSON = require('../../build/contracts/GSNProfile.json');

module.exports.initializeProfileFactory = async (web3, { contractAddr, relayHub, from, factoryFundingInPht, profileFundingInPht }) => {

  // Step 0: Validate arguments
  if (!Web3.utils.isAddress(from)) {
    throw new Error(`Invalid argument "from": ${from}. Expected eth address`);
  }

  if (!Web3.utils.isAddress(relayHub)) {
    throw new Error(`Invalid argument "relayHub": ${relayHub}. Expected eth address`);
  }

  if (!Web3.utils.isAddress(contractAddr)) {
    throw new Error(`Invalid argument "profileFactoryAddr": ${contractAddr}. Expected eth address`);
  }

  if (isNaN(parseFloat(factoryFundingInPht))) {
    throw new Error(`Invalid "factoryFundingInPht" value ${factoryFundingInPht}. Expected a float number`);
  }

  if (isNaN(parseFloat(profileFundingInPht))) {
    throw new Error(`Invalid "profileFundingInPht" value ${profileFundingInPht}. Expected a float number`);
  }

  const isRelayHub = await isRelayHubDeployed(web3, { relayHub });
  if(!isRelayHub) {
    throw new Error(`RelayHub is not found at ${relayHub}`);
  }
  
  // Step 2: Initialize gsn feature within profile factory contract
  const txReceipt = await Web3.contractSendTx(web3, {
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

  // Step 3: Top up factory contract
  await Web3.sendTransaction(web3, { from, to: contractAddr, valueInPht: factoryFundingInPht });
  console.log(`Topped up ProfileFactory with ${factoryFundingInPht} PHTs...`);

  await fundRecipient(web3, {
    from,
    recipient: contractAddr,
    relayHub: relayHub,
    amountInPht: profileFundingInPht
  });

  console.log(`Recipient ${contractAddr} is sponsored by relayHub with ${profileFundingInPht} PHTs...`);
  return contractAddr;
};

module.exports.deployProfile = async (web3, { from, profileFactoryAddr, useGSN }) => {
  const txReceipt = await Web3.contractSendTx(web3, {
    to: profileFactoryAddr,
    from,
    useGSN: useGSN || false,
    abi: factoryScJSON.abi,
    method: 'newProfile',
    params: [from]
  });

  return txReceipt.events['NewProfile'].returnValues['addr'];
};

module.exports.addOwner = async (web3, { from, ownerAddr, profileAddr, useGSN }) => {
  return Web3.contractSendTx(web3, {
    to: profileAddr,
    from,
    useGSN: useGSN || false,
    abi: factoryScJSON.abi,
    method: 'addOwner',
    params: [ownerAddr]
  });
};

module.exports.recover = async (web3, contractAddr, { from, newOwner, useGSN }) => {
  if (!newOwner && !from) {
    throw new Error(`Missing mandatory call params`);
  }

  return Web3.contractSendTx(web3, {
    to: contractAddr,
    from: from,
    useGSN: useGSN || false,
    method: 'recover',
    abi: profileScJSON.abi,
    params: [newOwner],
  })
};
