/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');

const { parseResponse } = require('../lib/response');
const { defaultOptions } = require('../lib/request');

const SIGN_IN_PATH = '/user/signin';
const SIGN_UP_PATH = '/user/signup';

module.exports = (gwDomain) => ({
  /**
   * Sign in a user into the system
   * @param account Account address
   * @param password The password that unlocks the account
   * @returns {Promise<{ token }>}
   */
  signIn: async (account, password) => {
    const options = {
      ...defaultOptions,
      body: {
        account,
        password,
      }
    };

    const gwResponse = await got.post(`${gwDomain}${SIGN_IN_PATH}`, options);
    return parseResponse(gwResponse);
  },
  /**
   * Create a new user on the gateway
   * @param password The password used to create a new Ethereum account
   * @returns {Promise<{ account }>}
   */
  signUp: async (password) => {
    const options = {
      ...defaultOptions,
      body: {
        password,
      }
    };

    const gwResponse = await got.post(`${gwDomain}${SIGN_UP_PATH}`, options);
    return parseResponse(gwResponse);
  }
});