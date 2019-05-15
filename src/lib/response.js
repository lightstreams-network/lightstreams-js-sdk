/**
 * User: ggarrido
 * Date: 12/02/19 12:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

const parseUnknownResponseError = (response) => {
  if (typeof response !== 'object') {
    return response;
  }

  if (typeof response.body !== 'object') {
    return new Error(response.body || message)
  }

  if (typeof response.body.error === 'object') {
    return new Error(response.body.error.message);
  }

  if (typeof response.body.message === 'string'
    || typeof response.body.message === 'undefined') {
    return new Error(response.body.message)
  }

  return new Error("Unknown Error");
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
  if (gwResponse.status !== 200) {
    return gwResponse.json().then(parsedResponse => {
      debugger;
      if (typeof parsedResponse === 'object' && typeof parsedResponse.error === 'object') {
        throw newErrorGatewayResponse(parsedResponse.error);
      }
      throw parseUnknownResponseError(parsedResponse);
    })
  } else {
    return gwResponse.json().then(parsedResponse => {
      const { error, ...response } = parsedResponse;
      if (error) {
        throw newErrorGatewayResponse(error);
      }

      return response;
    })
  }
};
