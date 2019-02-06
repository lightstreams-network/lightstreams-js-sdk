/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { parseGatewayError } = require('../lib/error');

const WALLET_BALANCE_PATH = '/wallet/balance';
const WALLET_TRANSFER_PATH = '/wallet/transfer';

module.exports.balance = (gwDomain) => async (account) => {
  const options = {
    json: true,
    query: {
      account
    },
  };

  try {
    const gwResponse = await got.get(`${gwDomain}${WALLET_BALANCE_PATH}`, options);
    const { error, ...response } = gwResponse.body;
    if (!_.isEmpty(error)) {
      parseGatewayError(err);
    }
    return response;
  } catch (err) {
    parseGatewayError(err);
  }
};

module.exports.transfer = (gwDomain) => async (from, password, to, amountWei) => {
  const options = {
    json: true,
    body: {
      from: from,
      password: password,
      to: to,
      amount_wei: amountWei.toString()
    }
  };

  try {
    const gwResponse = await got.post(`${gwDomain}${WALLET_TRANSFER_PATH}`, options);
    const { error, ...response } = gwResponse.body;
    if (!_.isEmpty(error)) {
      parseGatewayError(err);
    }
    return response;
  } catch (err) {
    parseGatewayError(err);
  }
};