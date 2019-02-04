/**
 * User: ggarrido
 * Date: 4/02/19 11:25
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');

module.exports = (domain) => {

  const initEndpoint = (endpoint) => endpoint(domain);

  return {
    user: _.mapValues(require('./user'), initEndpoint),
    // storage: _.map(require('./storage'), initEndpoint),
    // wallet: _.map(require('./wallet'), initEndpoint),
    // acl: _.map(require('./acl'), initEndpoint),
    // erc20: _.map(require('./erc20'), initEndpoint)
  }
};