"use strict";

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var request = require('../http/request');

var WALLET_BALANCE_PATH = '/wallet/balance';
var WALLET_TRANSFER_PATH = '/wallet/transfer';

module.exports = function (gwDomain) {
  return {
    /**
     * Get wallet balance from an account
     * @param account Account address
     * @returns {Promise<{ balance }>}
     */
    balance: function balance(account) {
      return request.get("".concat(gwDomain).concat(WALLET_BALANCE_PATH), {
        account: account
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
    transfer: function transfer(from, password, to, amountWei) {
      return request.post("".concat(gwDomain).concat(WALLET_TRANSFER_PATH), {
        from: from,
        password: password,
        to: to,
        amount_wei: amountWei.toString()
      });
    }
  };
};