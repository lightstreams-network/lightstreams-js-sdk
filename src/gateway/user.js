/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { ErrorGatewayResponse } = require('../lib/response');

const SIGN_IN_PATH = '/user/signin';
const SIGN_UP_PATH = '/user/signup';


module.exports.signIn = (gwDomain) => async (account, password) => {
  const options = {
    json: true,
    throwHttpErrors: false,
    body: {
      account,
      password,
    }
  };

  const gwResponse = await got.post(`${gwDomain}${SIGN_IN_PATH}`, options);
  const { error, ...response } = gwResponse.body;
  if (!_.isEmpty(error)) {
    throw ErrorGatewayResponse(error);
  }
  return response;
};

module.exports.signUp = (gwDomain) => async (password) => {
  const options = {
    json: true,
    throwHttpErrors: false,
    body: {
      password,
    }
  };

  const gwResponse = await got.post(`${gwDomain}${SIGN_UP_PATH}`, options);
  const { error, ...response } = gwResponse.body;
  if (!_.isEmpty(error)) {
    throw ErrorGatewayResponse(error);
  }

  return response;
};