/**
 * User: ggarrido
 * Date: 4/02/19 15:16
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');


const extractRequestAttrs = (req, query) => {
  const params = { ...req.body, ...req.query };
  return _.reduce(Object.keys(params), (result, key) => {
    if (query.indexOf(key) !== -1) {
      result[key] = params[key];
    }
    return result;
  }, {});
};

module.exports.extractRequestAttrs = extractRequestAttrs;

module.exports.validateRequestAttrs = (req, query) => {
  const attrs = extractRequestAttrs(req, query);
  for (let i = 0; i < query.length ; i++) {
    const param = query[i];
    if (!attrs[param]) {
      throw new Error(`Missing query param: ${param}`);
    }
  }
};
