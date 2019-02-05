/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { parseGatewayError } = require('../lib/error');

const SIGN_IN_PATH = '/user/signin';
const SIGN_UP_PATH = '/user/signup';


module.exports.signIn = (gwDomain) => async (account, password) => {
  const options = {
    json: true,
    body: {
      account,
      password,
    }
  };

  try {
    const response = await got.post(`${gwDomain}${SIGN_IN_PATH}`, options);
    const { token, error } = response.body;
    if (!_.isEmpty(error)) {
      parseGatewayError(err);
    }
    return { token };
  } catch (err) {
    parseGatewayError(err);
  }
};

module.exports.signUp = (gwDomain) => async (password) => {
  const options = {
    json: true,
    body: {
      password,
    }
  };

  try {
    const response = await got.post(`${gwDomain}${SIGN_UP_PATH}`, options);
    const { account, error } = response.body;
    if (!_.isEmpty(error)) {
      parseGatewayError(err);
    }
    return { account };
  } catch (err) {
    parseGatewayError(err);
  }
};