/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

module.exports = (gwDomain) => ({
  user: require('./src/gateway/user')(gwDomain),
  wallet: require('./src/gateway/wallet')(gwDomain),
  storage: require('./src/gateway/storage')(gwDomain),
  acl: require('./src/gateway/acl')(gwDomain),
  erc20: require('./src/gateway/erc20')(gwDomain),
});