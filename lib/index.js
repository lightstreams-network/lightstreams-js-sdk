/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';

module.exports = function (gwDomain) {
  return {
    user: require('./gateway/user')(gwDomain),
    wallet: require('./gateway/wallet')(gwDomain),
    storage: require('./gateway/storage')(gwDomain),
    acl: require('./gateway/acl')(gwDomain),
    erc20: require('./gateway/erc20')(gwDomain)
  };
};