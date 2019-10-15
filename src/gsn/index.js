/**
 * User: ggarrido
 * Date: 4/10/19 13:37
 * Copyright 2019 (c) Lightstreams, Granada
 */


const { fromConnection } = require('@openzeppelin/network');
const { fundRecipient: fRecipient, getRelayHub } = require('@openzeppelin/gsn-helpers/src/helpers');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = require('@openzeppelin/gsn-provider').utils;
const web3Utils = require('web3-utils');

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

// The "from" account is sending "amountInPht" tokens to the "relayHub" address to sponsor the usage
// of the smart contract address specified at the "recipient"
module.exports.fundRecipient = async (web3, { from, recipient, relayHub, amountInPht }) => {
  if(!web3Utils.isAddress(from)) {
    throw new Error(`Invalid "from" address ${from}. Expected a valid eth addr`);
  }

  if (!web3Utils.isAddress(recipient)) {
    throw new Error(`Invalid "recipient" address ${recipient}. Expected a valid eth addr`);
  }

  if (!web3Utils.isAddress(relayHub)) {
    throw new Error(`Invalid "relayHub" address ${relayHub}. Expected a valid eth addr`);
  }

  // Validate RelayHub exists at the passed address
  await getRelayHub(web3, relayHub);

  if(isNaN(parseFloat(amountInPht))) {
    throw new Error(`Invalid "amountInPht" value ${amountInPht}. Expected a float number`);
  }

  console.log(`Account ${from} depositing ${amountInPht} PHT in relayhub ${relayHub} to fund recipient ${recipient} `);
  const curBalance = await fRecipient(web3, {
    from,
    recipient,
    relayHubAddress: relayHub,
    // IMPORTANT: Amount cannot be higher than relay server address balance (@TODO: Implement validation)
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