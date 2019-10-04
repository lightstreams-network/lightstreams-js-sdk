/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const { web3GSNProvider } = require('../web3-provider');

const factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');
const profileScJSON = require('../../build/contracts/GSNProfile.json');
const { fundRecipient } = require('@openzeppelin/gsn-helpers');

module.exports.deployGSNFactory = async (web3, { relayHub, from, factoryFundingInPht, profileFundingInPht } ) => {
  // Step 1: Deploy Profile factory smart contract
  let txHash = await Web3.deployContract(web3, {
    from,
    abi: factoryScJSON.abi,
    bytecode: factoryScJSON.bytecode,
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
    recipient: profileFactoryAddr,
    relayHubAddress: relayHub,
    amount: web3.utils.toWei(profileFundingInPht, "ether")
  });
};

module.exports.deployWithGSN = async (web3, { account, profileFactoryAddr }) => {
  if (!account.address || !account.privateKey) {
    throw new Error(`Requires unlocked account's decrypted web3 obj with its address and private key attrs`);
  }

  const gsnWeb3 = await web3GSNProvider({ host: web3.currentProvider.host, privateKey: account.privateKey });

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

  const gsnWeb3 = await web3GSNProvider({ host: web3.currentProvider.host, privateKey: account.privateKey });

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
