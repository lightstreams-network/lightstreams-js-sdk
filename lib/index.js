'use strict';

module.exports = function (gwDomain) {
  return {
    user: require('./gateway/user')(gwDomain),
    wallet: require('./gateway/wallet')(gwDomain),
    storage: require('./gateway/storage')(gwDomain),
    acl: require('./gateway/acl')(gwDomain),
    shop: require('./gateway/shop')(gwDomain),
    erc20: require('./gateway/erc20')(gwDomain)
  };
};