/**
 * User: ggarrido
 * Date: 4/02/19 15:16
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');

module.exports.extractRequestAttrs = (req, fields) => {
  const params = { ...req.body, ...req.query };
  return _.reduce(Object.keys(params), (result, key) => {
    if (fields.indexOf(key) !== -1) {
      result[key] = params[key];
    }
    return result;
  }, {});
};
