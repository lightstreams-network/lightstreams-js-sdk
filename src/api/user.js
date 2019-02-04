/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { handleGatewayError } = require('../lib/error');

const SIGN_IN_PATH = '/user/signin';
const SIGN_UP_PATH = '/user/signup';


module.exports.signIn = (gwDomain) => (account, password) => {
  const options = {
    json: true,
    body: {
      account,
      password,
    }
  };

  return got.post(`${gwDomain}${SIGN_IN_PATH}`, options)
    .then(response => {
      const { token, error } = response.body;
      if (!_.isEmpty(error)) {
        handleGatewayError(err);
      }
      return { token };
    }).catch(err => {
      handleGatewayError(err);
    });
};

module.exports.signUp = (gwDomain) => (password) => {
  const options = {
    json: true,
    body: {
      password,
    }
  };
  return got.post(`${gwDomain}${SIGN_UP_PATH}`, options)
    .then(response => {
      const { account, error } = response.body;
      if (!_.isEmpty(error)) {
        handleGatewayError(err);
      }
      return { account };
    })
    .catch(err => {
      handleGatewayError(err);
    });
};