/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const { Web3: Web3GSN, fundRecipient, isRelayHubDeployed } = require('../gsn');
const web3Utils = require('web3-utils');

const factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');
const profileScJSON = require('../../build/contracts/GSNProfile.json');

module.exports.deployGSNFactory = async (web3, { relayHub, from, factoryFundingInPht, profileFundingInPht }) => {

  // Step 0: Validate arguments
  if (!web3Utils.isAddress(from)) {
    throw new Error(`Invalid argument "from": ${from}. Expected eth address`);
  }

  if (!web3Utils.isAddress(relayHub)) {
    throw new Error(`Invalid argument "relayHub": ${relayHub}. Expected eth address`);
  }

  if (isNaN(parseFloat(factoryFundingInPht))) {
    throw new Error(`Invalid "factoryFundingInPht" value ${factoryFundingInPht}. Expected a float number`);
  }

  if (isNaN(parseFloat(profileFundingInPht))) {
    throw new Error(`Invalid "profileFundingInPht" value ${profileFundingInPht}. Expected a float number`);
  }

  const isRelayHub = await isRelayHubDeployed(web3, {relayHub});
  if(!isRelayHub) {
    throw new Error(`RelayHub is not found at ${relayHub}`);
  }

  // Step 1: Deploy Profile factory smart contract
  console.log(`Deploying profile factory...`);
  let txHash = await Web3.deployContract(web3, {
    from,
    abi: factoryScJSON.abi,
    bytecode: factoryScJSON.bytecode,
    params: [Web3.toWei(web3, { pht: profileFundingInPht })]
  });

  let txReceipt = await Web3.getTxReceipt(web3, { txHash });
  if (!txReceipt.status) {
    console.error(txReceipt);
    throw new Error(`Tx failed ${txHash}`);
  }
  const profileFactoryAddr = txReceipt.contractAddress;
  console.log(`GSNProfileFactory.sol successfully deployed at ${profileFactoryAddr}!`);

  // Step 2: Initialize gsn feature within profile factory contract
  txHash = await Web3.contractSendTx(web3, profileFactoryAddr, {
    from,
    abi: factoryScJSON.abi,
    method: 'initialize',
    params: [relayHub]
  });

  txReceipt = await Web3.getTxReceipt(web3, { txHash });
  if (!txReceipt.status) {
    console.error(txReceipt);
    throw new Error(`Tx failed ${txHash}`);
  }
  console.log(`Activated GSN for ProfileFactory instance for RelayHub ${relayHub}...`);

  // Step 3: Top up factory contract
  txHash = await Web3.sendTransaction(web3, { from, to: profileFactoryAddr, valueInPht: factoryFundingInPht });
  txReceipt = await Web3.getTxReceipt(web3, { txHash });
  if (!txReceipt.status) {
    console.error(txReceipt);
    throw new Error(`Tx failed ${txHash}`);
  }
  console.log(`Topped up ProfileFactory with ${factoryFundingInPht} PHTs...`);

  await fundRecipient(web3, {
    from,
    recipient: profileFactoryAddr,
    relayHub: relayHub,
    amountInPht: profileFundingInPht
  });

  console.log(`Recipient ${profileFactoryAddr} is sponsored by relayHub with ${profileFundingInPht} PHTs...`);
};

module.exports.deployWithGSN = async (web3, { account, profileFactoryAddr }) => {
  if (!account.address || !account.privateKey) {
    throw new Error(`Requires unlocked account's decrypted web3 obj with its address and private key attrs`);
  }

  const gsnWeb3 = await Web3GSN({ host: web3.currentProvider.host, privateKey: account.privateKey });

  const txHash = Web3.contractSendTx(gsnWeb3, profileFactoryAddr, {
    from: account.address,
    abi: factoryScJSON.abi,
    method: 'newProfile',
    params: [RELAY_HUB]
  });

  const txReceipt = await Web3.getTxReceipt(web3, { txHash });
  if (!txReceipt.status) {
    throw new Error(`Failed to create a new profile. TX: ${txHash}`);
  }

  return txReceipt.events['NewProfile'].returnValues['addr'];
};

module.exports.addOwnerWithGSN = async (web3, { account, ownerAddr, profileAddr }) => {
  if (!account.address || !account.privateKey) {
    throw new Error(`Requires unlocked account's decrypted web3 obj with its address and private key attrs`);
  }

  const gsnWeb3 = await Web3GSN({ host: web3.currentProvider.host, privateKey: account.privateKey });

  const txHash = Web3.contractSendTx(gsnWeb3, profileAddr, {
    from: account.address,
    abi: factoryScJSON.abi,
    method: 'addOwner',
    params: [ownerAddr]
  });

  const txReceipt = await Web3.getTxReceipt(web3, { txHash });
  if (!txReceipt.status) {
    throw new Error(`Failed to add a new profile owner. TX: ${txReceipt.transactionHash}`);
  }
};

module.exports.recover = (web3, contractAddr, { from, newOwner }) => {
  if (!newOwner && !from) {
    throw new Error(`Missing mandatory call params`);
  }

  return Web3.contractSendTx(web3, contractAddr, {
    from: from,
    method: 'recover',
    abi: profileScJSON.abi,
    params: [newOwner],
  }).then((txHash) => {
    return Web3.getTxReceipt(web3, { txHash });
  })
};
