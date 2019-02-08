/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { extractResponse, defaultOptions } = require('../lib/gateway');

const SIGN_IN_PATH = '/user/signin';
const SIGN_UP_PATH = '/user/signup';

module.exports = (gwDomain) => ({
  /**
   *
   * @param account
   * @param password
   * @returns {Promise<*>}
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
    return extractResponse(gwResponse);
  },
  /**
   *
   * @param password
   * @returns {Promise<*>}
   */
  signUp: async (password) => {
    const options = {
      ...defaultOptions,
      body: {
        password,
      }
    };

    const gwResponse = await got.post(`${gwDomain}${SIGN_UP_PATH}`, options);
    return extractResponse(gwResponse);
  }
});