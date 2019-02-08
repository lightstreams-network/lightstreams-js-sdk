/**
 * User: ggarrido
 * Date: 4/02/19 11:22
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { extractResponse, defaultOptions } = require('../lib/gateway');

const ERC20_BALANCE_PATH = `/erc20/balance`;
const ERC20_TRANSFER_PATH = `/erc20/transfer`;
const ERC20_PURCHASE_PATH = `/erc20/purchase`;

module.exports = (gwDomain) => ({
  /**
   *
   * @param erc20_address
   * @param account
   * @returns {Promise<*>}
   */
  balance: async (erc20_address, account) => {
    const options = {
      ...defaultOptions,
      query: {
        erc20_address,
        account
      },
    };

    const gwResponse = await got.get(`${gwDomain}${ERC20_BALANCE_PATH}`, options);
    return extractResponse(gwResponse);
  },

  /**
   *
   * @param erc20_address
   * @param from
   * @param password
   * @param to
   * @param amount
   * @returns {Promise<*>}
   */
  transfer: async (erc20_address, from, password, to, amount) => {
    const options = {
      ...defaultOptions,
      body: {
        erc20_address,
        from,
        password,
        to,
        amount: amount.toString()
      },
    };

    const gwResponse = await got.post(`${gwDomain}${ERC20_TRANSFER_PATH}`, options);
    return extractResponse(gwResponse);
  },
  /**
   *
   * @param erc20_address
   * @param account
   * @param password
   * @param amount_wei
   * @returns {Promise<*>}
   */
  purchase: async (erc20_address, account, password, amount_wei) => {
    const options = {
      ...defaultOptions,
      body: {
        erc20_address,
        password,
        account,
        amount_wei: amount_wei.toString()
      },
    };

    const gwResponse = await got.post(`${gwDomain}${ERC20_PURCHASE_PATH}`, options);
    return extractResponse(gwResponse);
  }
});