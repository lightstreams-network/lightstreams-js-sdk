/**
 * User: ggarrido
 * Date: 4/02/19 11:40
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');
const { ErrorGatewayResponse } = require('../lib/response');

const parseUnknownResponseError = (response) => {
  if (typeof response !== 'object') {
    throw response;
  }

  if (typeof response.body !== 'object') {
    throw new Error(response.body || message)
  }

  if (typeof response.body.error === 'object') {
    throw new Error(response.body.error.message);
  }

  if (typeof response.body.message === 'string'
    || typeof response.body.message === 'undefined') {
    throw new Error(response.body.message)
  }

  throw new Error("Unknown Error");
};

module.exports.extractResponse = (gwResponse) => {

  if (gwResponse.statusCode !== 200) {
    if (typeof gwResponse.body === 'object' && typeof gwResponse.body.error === 'object') {
      throw ErrorGatewayResponse(gwResponse.body.error);
    }
    parseUnknownResponseError(gwResponse);
  }

  const { error, ...response } = gwResponse.body;
  if (!_.isEmpty(error)) {
    throw ErrorGatewayResponse(error);
  }

  return response;
};

module.exports.defaultOptions = {
  json: true,
  throwHttpErrors: false,
  followRedirect: false,
};


