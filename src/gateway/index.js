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
    wallet: _.mapValues(require('./wallet'), initEndpoint),
    storage: _.mapValues(require('./storage'), initEndpoint),
    acl: _.mapValues(require('./acl'), initEndpoint),
    // erc20: _.mapValues(require('./erc20'), initEndpoint)
  }
};