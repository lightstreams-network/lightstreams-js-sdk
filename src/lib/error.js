/**
 * User: ggarrido
 * Date: 4/02/19 11:40
 * Copyright 2019 (c) Lightstreams, Palma
 */


module.exports.parseGatewayError = (err) => {
  if (typeof err.response !== 'object') {
    throw err;
  }

  if (typeof err.response.body !== 'object') {
    throw new Error(err.response.body || err.message)
  }

  if (typeof err.response.body.error === 'object') {
    throw new Error(err.response.body.error.message);
  }

  if (typeof err.response.body.message === 'string'
    || typeof err.response.body.message === 'undefined') {
    throw new Error(err.response.body.message)
  }

  throw new Error("Invalid Gateway error");
};

