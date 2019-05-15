/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const request = require('../lib/request');

const WALLET_BALANCE_PATH = '/wallet/balance';
const WALLET_TRANSFER_PATH = '/wallet/transfer';

module.exports = (gwDomain) => ({
  /**
   * Get wallet balance from an account
   * @param account Account address
   * @returns {Promise<{ balance }>}
   */
  balance: (account) => {
    return request.get(`${gwDomain}${WALLET_BALANCE_PATH}`, {
      account
    });
  },

  /**
   * Transfer funds to an account
   * @param from Account address to transfer funds from
   * @param password The password that unlocks the account
   * @param to Account address to transfer funds to
   * @param amountWei Amount in wei
   * @returns {Promise<{ balance }>} Remaining balance on from account
   */
  transfer: (from, password, to, amountWei) => {
    return request.post(`${gwDomain}${WALLET_TRANSFER_PATH}`, {
      from: from,
      password: password,
      to: to,
      amount_wei: amountWei.toString()
    });
  }
});