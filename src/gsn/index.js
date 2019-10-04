/**
 * User: ggarrido
 * Date: 4/10/19 13:37
 * Copyright 2019 (c) Lightstreams, Granada
 */


const { fromConnection } = require('@openzeppelin/network');
const { fundRecipient: fRecipient } = require('@openzeppelin/gsn-helpers');
const web3Utils = require('web3-utils');

module.exports.Web = ({ host, dev, privateKey }) => {
  return fromConnection(host, {
    gsn: {
      dev: dev || false,
      signKey: privateKey
    }
  }).then(ctx => {
    return ctx.lib
  });
};

// From account is sending $amountInPht tokens to the relayHub to sponsor the usage
// of the smart contract address specified at the recipient
module.exports.fundRecipient = (web3, { from, recipient, relayHub, amountInPht }) => {
  // @TODO: Validate relayHub has funds enough
  if(!web3Utils.isAddress(from)) {
    throw new Error(`Invalid "from" address ${from}. Expected a valid eth addr`);
  }

  if (!web3Utils.isAddress(recipient)) {
    throw new Error(`Invalid "recipient" address ${recipient}. Expected a valid eth addr`);
  }

  if (!web3Utils.isAddress(relayHub)) {
    throw new Error(`Invalid "relayHub" address ${relayHub}. Expected a valid eth addr`);
  }

  if(isNaN(parseFloat(amountInPht))) {
    throw new Error(`Invalid "amountInPht" value ${amountInPht}. Expected a float number`);
  }

  return fRecipient(web3, {
    from,
    recipient,
    relayHubAddress: relayHub,
    amount: web3.utils.toWei(amountInPht, "ether")
  });
};