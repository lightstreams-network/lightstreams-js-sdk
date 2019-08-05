/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */

const request = require('../http/request');

const SIGN_IN_PATH = '/user/signin';
const SIGN_UP_PATH = '/user/signup';

module.exports = (gwDomain) => ({
  /**
   * Sign in a user into the system
   * @param account Account address
   * @param password The password that unlocks the account
   * @returns {Promise<{ token }>}
   */
  signIn: (account, password) => {
    return request.post(`${gwDomain}${SIGN_IN_PATH}`, {
      account,
      password,
    });
  },
  /**
   * Create a new user on the gateway
   * @param password The password used to create a new Ethereum account
   * @returns {Promise<{ account }>}
   */
  signUp: (password) => {
    return request.post(`${gwDomain}${SIGN_UP_PATH}`, {
      password,
    });
  }
});