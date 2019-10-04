/**
 * User: ggarrido
 * Date: 4/10/19 13:37
 * Copyright 2019 (c) Lightstreams, Granada
 */


const { fromConnection } = require('@openzeppelin/network');
const { fundRecipient } = require('@openzeppelin/gsn-helpers');

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

module.exports.fundRecipient = (web3, { from, recipient, relayHub, amountInPht }) => {
  // @TODO: Validate relayHub has funds enough
  return fundRecipient(web3, {
    from,
    recipient,
    relayHubAddress: relayHub,
    amount: web3.utils.toWei(amountInPht, "ether")
  });
};