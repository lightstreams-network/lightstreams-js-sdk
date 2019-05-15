"use strict";

/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */
var request = require('../lib/request');

var SIGN_IN_PATH = '/user/signin';
var SIGN_UP_PATH = '/user/signup';

module.exports = function (gwDomain) {
  return {
    /**
     * Sign in a user into the system
     * @param account Account address
     * @param password The password that unlocks the account
     * @returns {Promise<{ token }>}
     */
    signIn: function signIn(account, password) {
      return request.post("".concat(gwDomain).concat(SIGN_IN_PATH), {
        account: account,
        password: password
      });
    },

    /**
     * Create a new user on the gateway
     * @param password The password used to create a new Ethereum account
     * @returns {Promise<{ account }>}
     */
    signUp: function signUp(password) {
      return request.post("".concat(gwDomain).concat(SIGN_UP_PATH), {
        password: password
      });
    }
  };
};