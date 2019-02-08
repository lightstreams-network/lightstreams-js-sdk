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
   * Get balance of any erc20 token
   * @param erc20_address Address of the erc20 token contract
   * @param account Account address for which to check the balance
   * @returns {Promise<{ balance }>}
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
   * Transfer erc20 token to an account
   * @param erc20_address ERC20 token address
   * @param from Account address to transfer funds from
   * @param password The password that unlocks the account
   * @param to Account address to transfer funds to
   * @param amount Amount in erc20 token
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
   * Sending tokens to ICO contract and purchase tokens
   * @param erc20_address ERC20 token address
   * @param account Account address to transfer funds from
   * @param password The password that unlocks the account
   * @param amount_wei Amount in wei to purchase
   * @returns {Promise<{ tokens }>}
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