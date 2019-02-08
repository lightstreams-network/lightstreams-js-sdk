/**
 * User: ggarrido
 * Date: 4/02/19 11:25
 * Copyright 2019 (c) Lightstreams, Palma
 */

module.exports = (gwDomain) => ({
  user: require('./user')(gwDomain),
  wallet: require('./wallet')(gwDomain),
  storage: require('./storage')(gwDomain),
  acl: require('./acl')(gwDomain),
  erc20: require('./erc20')(gwDomain),
});