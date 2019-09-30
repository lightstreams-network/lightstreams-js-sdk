/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('../web3');
const factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');
const profileScJSON = require('../../build/contracts/GSNProfile.json');
const { fromConnection } = require('@openzeppelin/network');

module.exports.deployWithGSN = async (web3, { account, profileFactoryAddr }) => {
  if (!account.address || !account.privateKey) {
    throw new Error(`Requires unlocked account's decrypted web3 obj with its address and private key attrs`);
  }

  const gsnCtx = await fromConnection(
    web3.currentProvider.host, {
      gsn: {
        dev: false,
        signKey: account.privateKey
      }
    });

  const factoryGSN = await new gsnCtx.lib.eth.Contract(factoryScJSON.abi, profileFactoryAddr);

  const txReceipt = await factoryGSN.methods.newProfile(account.address).send({
    from: account.address,
    gasPrice: "500000000000",
    gasLimit: "7000000",
  });

  if (!txReceipt.status) {
    throw new Error(`Failed to create a new profile. TX: ${txReceipt.transactionHash}`);
  }

  return txReceipt.events['NewProfile'].returnValues['addr'];
};

module.exports.addOwnerWithGSN = async (web3, { account, ownerAddr, profileAddr }) => {
  if (!account.address || !account.privateKey) {
    throw new Error(`Requires unlocked account's decrypted web3 obj with its address and private key attrs`);
  }

  const gsnCtx = await fromConnection(
    web3.currentProvider.host, {
      gsn: {
        dev: false,
        signKey: account.privateKey
      }
    });

  const profileSc = await new gsnCtx.lib.eth.Contract(profileScJSON.abi, profileAddr);

  const txReceipt = await profileSc.methods.addOwner(ownerAddr).send({
    from: account.address,
    gasPrice: "500000000000",
    gasLimit: "7000000",
  });

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
