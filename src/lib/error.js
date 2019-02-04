/**
 * User: ggarrido
 * Date: 4/02/19 11:40
 * Copyright 2019 (c) Lightstreams, Palma
 */


module.exports.handleGatewayError = (err) => {
  if (typeof err.response === "string") {
    throw err;
  }

  if (typeof err.response.body === "string") {
    throw new Error(err.response.body)
  }

  if (typeof err.response.body.message === "string") {
    throw new Error(err.response.body.message)
  }

  if (typeof err.response.body.error.message === "string") {
    throw new Error(err.response.body.error.message)
  }

  throw new Error("Invalid Gateway error");
};

