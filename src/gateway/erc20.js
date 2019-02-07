/**
 * User: ggarrido
 * Date: 4/02/19 11:22
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { parseGatewayError } = require('../lib/gateway');

const URL_GET_ICO_BALANCE = `${urls.GATEWAY_DOMAIN}/erc20/balance`;
const URL_TRANSFER_ICO = `${urls.GATEWAY_DOMAIN}/erc20/transfer`;
const URL_PURCHASE_ICO = `${urls.GATEWAY_DOMAIN}/erc20/purchase`;

module.exports.purchaseCoins = (ethAddress, icoAddress, password, weiAmount) => {
  const options = {
    json: true,
    throwHttpErrors: false,
    body: {
      erc20_address: icoAddress,
      password: password,
      account: ethAddress,
      amount_wei: weiAmount.toString()
    },
  };

  debug(`POST: ${URL_PURCHASE_ICO}\t${JSON.stringify(options)}`);
  return got.post(URL_PURCHASE_ICO, options)
    .then((response) => {
      const { tokens } = response.body;
      return {
        coins: tokens
      }
    }).catch(err => {
      parseGatewayError(err);
    });
};

module.exports.getCoinBalance = (ethAddress, icoAddress) => {
  const options = {
    json: true,
    query: {
      erc20_address: icoAddress,
      account: ethAddress
    },
  };

  debug(`GET: ${URL_GET_ICO_BALANCE}\t${JSON.stringify(options)}`);
  return got.get(URL_GET_ICO_BALANCE, options)
    .then((response) => {
      const { balance } = response.body;
      return {
        balance
      }
    }).catch(err => {
      parseGatewayError(err);
    });
};

module.exports.transferIco = (icoAddress, artistAccount, sourceEthAddress, password, amount) => {
  const options = {
    json: true,
    body: {
      erc20_address: icoAddress,
      account: sourceEthAddress,
      password: password,
      to: artistAccount,
      amount: amount.toString()
    },
  };

  debug(`POST: ${URL_TRANSFER_ICO}\t${JSON.stringify(options)}`);
  return got.post(URL_TRANSFER_ICO, options)
    .then(gwResponse => {
      const { balance } = gwResponse.body;
      return {
        balance
      }
    }).catch(err => {
      parseGatewayError(err);
    });
};