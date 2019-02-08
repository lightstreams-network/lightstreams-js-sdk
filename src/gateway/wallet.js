/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { extractResponse, defaultOptions } = require('../lib/gateway');

const WALLET_BALANCE_PATH = '/wallet/balance';
const WALLET_TRANSFER_PATH = '/wallet/transfer';

module.exports = (gwDomain) => ({
  /**
   *
   * @param account
   * @returns {Promise<*>}
   */
  balance: async (account) => {
    const options = {
      ...defaultOptions,
      query: {
        account
      },
    };

    const gwResponse = await got.get(`${gwDomain}${WALLET_BALANCE_PATH}`, options);
    return extractResponse(gwResponse);
  },

  /**
   *
   * @param from
   * @param password
   * @param to
   * @param amountWei
   * @returns {Promise<*>}
   */
  transfer: async (from, password, to, amountWei) => {
    const options = {
      ...defaultOptions,
      body: {
        from: from,
        password: password,
        to: to,
        amount_wei: amountWei.toString()
      }
    };

    const gwResponse = await got.post(`${gwDomain}${WALLET_TRANSFER_PATH}`, options);
    return extractResponse(gwResponse);
  }
});