'use strict'; // Fix Error: More than one instance of bitcore-lib found. Please make sure to require bitcore-lib
// and check that submodules do not also include their own bitcore-lib dependency.

Object.defineProperty(global, '_bitcore', {
  get: function get() {
    return undefined;
  },
  set: function set() {}
});

module.exports.Gateway = function (gwDomain) {
  return {
    user: require('./gateway/user')(gwDomain),
    wallet: require('./gateway/wallet')(gwDomain),
    storage: require('./gateway/storage')(gwDomain),
    acl: require('./gateway/acl')(gwDomain),
    shop: require('./gateway/shop')(gwDomain),
    erc20: require('./gateway/erc20')(gwDomain)
  };
};

module.exports.Lightwallet = require('./lightwallet');