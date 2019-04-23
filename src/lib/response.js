/**
 * User: ggarrido
 * Date: 12/02/19 12:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

const _ = require('lodash');

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

const newErrorGatewayResponse = (gwErr) => {
  const err = new Error(gwErr.message);
  err.status = gwErr.code === 'ERROR_UNKNOWN' ? 500 : gwErr.code;
  return err;
};

module.exports.errorResponse = (msg, code) => {
  const err = new Error(msg);
  err.status = code || 500;
  return err;
};

module.exports.parseResponse = (gwResponse) => {

  if (gwResponse.statusCode !== 200) {
    if (typeof gwResponse.body === 'object' && typeof gwResponse.body.error === 'object') {
      throw newErrorGatewayResponse(gwResponse.body.error);
    }
    parseUnknownResponseError(gwResponse);
  }

  const { error, ...response } = gwResponse.body;
  if (!_.isEmpty(error)) {
    throw newErrorGatewayResponse(error);
  }

  return response;
};
