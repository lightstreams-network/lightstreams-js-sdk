/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
const Debug = require('debug');
const Web3Wrapper = require('../web3');

const {
  fundRecipient,
  isRelayHubDeployed,
  getRecipientFunds
} = require('../gsn');

const factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');
const profileScJSON = require('../../build/contracts/GSNProfile.json');
const logger = Debug('ls-sdk:contract:profile');

const {convertHexToCid, convertCidToBytes32} = require('../leth/cid');

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
    logger(`Activated GSN for ProfileFactory instance for RelayHub ${relayHub}...`);
  }

  // Step 3: Profile factory is funded via RelayHub
  await fundRecipient(web3, {
    from,
    recipient: contractAddr,
    relayHub: relayHub,
    amountInPht: `${factoryFundingInPht}`
  });

  logger(`Recipient ${contractAddr} is sponsored by relayHub with ${factoryFundingInPht} PHTs...`);

  // Step 4: Top up factory contract to fund new profile deployments
  await Web3Wrapper.sendTransaction(web3, { from, to: contractAddr, valueInPht: `${faucetFundingInPht}` });
  logger(`Topped up ProfileFactory with ${faucetFundingInPht} PHTs to fund new profile creations...`);

  return contractAddr;
};

module.exports.validateHasEnoughFundToDeployProfile = async(web3, { contractAddr }) => {
  const recipientFundsInWei = await getRecipientFunds(web3, { recipient: contractAddr });
  const recipientFundsInPht = Web3Wrapper.utils.toPht(`${recipientFundsInWei}`);
  logger(`GSNProfileFactory recipient has ${recipientFundsInPht} PHT for GSN`);
  if (parseFloat(recipientFundsInPht) < 1.0) {
    throw new Error(`Not enough recipient funds: ${recipientFundsInPht} PHT`);
  }

  const balanceInWei = await Web3Wrapper.getBalance(web3, { address: contractAddr });
  const balanceInPht = Web3Wrapper.utils.toPht(balanceInWei);
  logger(`GSNProfileFactory contract has ${balanceInPht} PHT in balance`);
  const newProfileFundingInWei = await Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: factoryScJSON.abi,
    method: 'profileFunding'
  });

  const newProfileFundingInPht = Web3Wrapper.utils.toPht(newProfileFundingInWei);
  if(parseFloat(balanceInPht) < parseFloat(newProfileFundingInPht)) {
    throw new Error(`Not enough funds in factory contract. Requires ${newProfileFundingInPht} PHT, has ${balanceInPht} PHT`);
  }
};

module.exports.deployProfileByFactory = async (web3, { from, owner, contractAddr, useGSN }) => {
  const txReceipt = await Web3Wrapper.contractSendTx(web3, {
    to: contractAddr,
    from,
    useGSN: useGSN || false,
    abi: factoryScJSON.abi,
    method: 'newProfile',
    params: [owner || from]
  });

  return txReceipt.events['NewProfile'].returnValues['addr'];
};

module.exports.deployProfileFactory = (web3, {from, profileFundingInPht}) => {
  return Web3Wrapper.deployContract(web3, {
    from,
    abi: factoryScJSON.abi,
    bytecode: factoryScJSON.bytecode,
    params: [Web3Wrapper.utils.toWei(`${profileFundingInPht}`)]
  });
};


module.exports.deployProfile = (web3, { from, owner }) => {
  return Web3Wrapper.deployContract(web3, {
    from,
    abi: profileScJSON.abi,
    bytecode: profileScJSON.bytecode,
    params: [owner]
  });
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

module.exports.getOwners = (web3, { contractAddr }) => {
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getOwners',
  }).then(owners => {
    return owners.map(addr => addr.toLowerCase())
  });
};

module.exports.getFiles = (web3, { contractAddr }) => {
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getFiles',
  }).then((files) => {
    return files.map(convertHexToCid);
  });
};

module.exports.getFileAcl = (web3, { contractAddr, cid }) => {
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getFileAcl',
    params: [convertCidToBytes32(cid)]
  });
};

module.exports.addFile = (web3, { from, contractAddr, cid, acl }) => {
  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'addFile',
    params: [convertCidToBytes32(cid), acl]
  });
};

module.exports.removeFile = (web3, { from, contractAddr, cid }) => {
  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'removeFile',
    params: [convertCidToBytes32(cid)]
  });
};

const transferToken = module.exports.transferToken = (web3, {from, beneficiary, contractAddr, amountInPht}) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("beneficiary", beneficiary);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'transferToken',
    params: [beneficiary, Web3Wrapper.utils.toWei(amountInPht)]
  });
};

module.exports.transferIERC20Token = (web3, {from, beneficiary, contractAddr, tokenAddr, amount}) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("beneficiary", beneficiary);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("tokenAddr", tokenAddr);
  Web3Wrapper.validator.validateWeiBn("amount", amount);

  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'transferIERC20Token',
    params: [tokenAddr, beneficiary, amount.toString()]
  });
};

module.exports.hatchArtistToken = async (web3, {from, contractAddr, artistTokenAddr, amountInPht, useGSN}) => {

  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

  const receipt = await Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'hatchArtistToken',
    useGSN,
    params: [artistTokenAddr, Web3Wrapper.utils.toWei(amountInPht), true]
  });

  if (!receipt.events['HatchedArtistTokens']) {
    return null;
  }

  const tokens = receipt.events['HatchedArtistTokens'].returnValues['amount'];
  logger(`Hatcher ${from} obtained an estimated amount of ${Web3Wrapper.utils.toPht(tokens).toString()} ArtistTokens ${artistTokenAddr}`);
  return Web3Wrapper.utils.toBN(tokens);
};

module.exports.claimArtistToken = async (web3, {from, contractAddr, artistTokenAddr, useGSN}) => {

  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

  const receipt = await Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'claimArtistToken',
    useGSN,
    params: [artistTokenAddr]
  });

  if (!receipt.events['ClaimedArtistTokens']) {
    return null;
  }

  const tokens = receipt.events['ClaimedArtistTokens'].returnValues['amount'];
  logger(`Hatcher ${from} claimed an amount of ${Web3Wrapper.utils.toPht(tokens).toString()} ArtistTokens ${artistTokenAddr}`);
  return Web3Wrapper.utils.toBN(tokens);
};

module.exports.refundArtistToken = async (web3, {from, contractAddr, artistTokenAddr, useGSN}) => {

  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

  const receipt = await Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'refundArtistToken',
    useGSN,
    params: [artistTokenAddr]
  });

  if (!receipt.events['RefundedTokens']) {
    return null;
  }

  const tokens = receipt.events['RefundedTokens'].returnValues['amount'];
  logger(`Hatcher ${from} get a refund of ${Web3Wrapper.utils.toPht(tokens).toString()} WPHT tokens`);
  return Web3Wrapper.utils.toBN(tokens);
};

module.exports.buyArtistToken = async(web3, {from, contractAddr, artistTokenAddr, amountInPht}) => {

  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

  const receipt = await Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'buyArtistToken',
    params: [artistTokenAddr, Web3Wrapper.utils.toWei(amountInPht), true]
  });

  if(!receipt.events['BoughtArtistTokens']) {
    return null;
  }

  const tokens = receipt.events['BoughtArtistTokens'].returnValues['amount'];
  logger(`Buyer ${from} purchased ${Web3Wrapper.utils.toPht(tokens).toString()} of ArtistTokens ${artistTokenAddr}`);
  return Web3Wrapper.utils.toBN(tokens);
};