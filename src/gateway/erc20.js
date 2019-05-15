/**
 * User: ggarrido
 * Date: 4/02/19 11:22
 * Copyright 2019 (c) Lightstreams, Palma
 */

const request = require('../lib/request');

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
  balance: (erc20_address, account) => {
    return request.get(`${gwDomain}${ERC20_BALANCE_PATH}`, {
      erc20_address,
      account
    });
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
  transfer: (erc20_address, from, password, to, amount) => {
    return request.post(`${gwDomain}${ERC20_TRANSFER_PATH}`, {
      erc20_address,
      from,
      password,
      to,
      amount: amount.toString()
    });
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
    return await request.post(`${gwDomain}${ERC20_PURCHASE_PATH}`, {
      erc20_address,
      password,
      account,
      amount_wei: amount_wei.toString()
    });
  }
});