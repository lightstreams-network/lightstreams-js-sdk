/**
 * User: ggarrido
 * Date: 4/10/19 13:37
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Debug = require('debug');
const { fromConnection } = require('@openzeppelin/network');
const { fundRecipient: fRecipient, getRelayHub } = require('@openzeppelin/gsn-helpers/src/helpers');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = require('@openzeppelin/gsn-provider').utils;
const web3Utils = require('web3-utils');
const Web3Wrapper = require('../web3');
const logger = Debug('ls-sdk:gsn');

module.exports.newWeb3Engine = (provider, { signKey, dev, verbose }) => {
  return fromConnection(provider, {
    gsn: {
      useGSN: true,
      dev: dev || false,
      verbose: verbose || false,
      signKey
    }
  }).then(ctx => {
    return ctx.lib
  });
};

module.exports.initializeRecipient = async (web3, {from, recipient, relayHub, abi}) => {
  if (!Web3Wrapper.utils.isAddress(from)) {
    throw new Error(`Invalid "from" address ${from}. Expected a valid eth addr`);
  }

  if (!Web3Wrapper.utils.isAddress(recipient)) {
    throw new Error(`Invalid "recipient" address ${recipient}. Expected a valid eth addr`);
  }

  if (!Web3Wrapper.utils.isAddress(relayHub)) {
    throw new Error(`Invalid "relayHub" address ${relayHub}. Expected a valid eth addr`);
  }

  // Validate RelayHub exists at the passed address
  await getRelayHub(web3, relayHub);

  return Web3Wrapper.contractSendTx(web3, {
    to: recipient,
    from,
    abi: abi,
    method: 'initialize',
    params: [relayHub]
  });
};

// The "from" account is sending "amountInPht" tokens to the "relayHub" address to sponsor the usage
// of the smart contract address specified at the "recipient"
module.exports.fundRecipient = async (web3, { from, recipient, relayHub, amountInPht }) => {
  if(!Web3Wrapper.utils.isAddress(from)) {
    throw new Error(`Invalid "from" address ${from}. Expected a valid eth addr`);
  }

  if (!Web3Wrapper.utils.isAddress(recipient)) {
    throw new Error(`Invalid "recipient" address ${recipient}. Expected a valid eth addr`);
  }

  if (!Web3Wrapper.utils.isAddress(relayHub)) {
    throw new Error(`Invalid "relayHub" address ${relayHub}. Expected a valid eth addr`);
  }

  // Validate RelayHub exists at the passed address
  await getRelayHub(web3, relayHub);

  if(isNaN(parseFloat(amountInPht))) {
    throw new Error(`Invalid "amountInPht" value ${amountInPht}. Expected a float number`);
  }

  // IMPORTANT: Amount cannot be higher than 10% relay server address balance
  // @TODO: Verify assumption and implement validation
  const maxFundingValueInPht = 100;
  if(parseFloat(amountInPht) > maxFundingValueInPht) {
    throw new Error(`GSN deposits cannot exceed ${maxFundingValueInPht}PHT`);
  }

  logger(`Account ${from} depositing ${amountInPht} PHT in relayhub ${relayHub} to fund recipient ${recipient} `);
  const curBalance = await fRecipient(web3, {
    from,
    recipient,
    relayHubAddress: relayHub,
    amount: web3Utils.toWei(amountInPht, "ether")
  });

  return curBalance;
};

module.exports.getRecipientFunds = async(web3, { recipient }) => {
  try {
    // Validate RelayHub exists at the passed address
    return await getRecipientFunds(web3, recipient);
  } catch ( err ) {
    console.error(err);
    return false;
  }
};

module.exports.isRelayHubDeployedForRecipient =  async(web3, { recipient }) => {
  try {
    // Validate RelayHub exists at the passed address
    return await isRelayHubDeployedForRecipient(web3, recipient);
  } catch ( err ) {
    console.error(err);
    return false;
  }
};

module.exports.isRelayHubDeployed = async (web3, { relayHub }) => {
  try {
    // Validate RelayHub exists at the passed address
    await getRelayHub(web3, relayHub);
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
};