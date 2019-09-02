'use strict';

// Fix Error: More than one instance of bitcore-lib found. Please make sure to require bitcore-lib
// and check that submodules do not also include their own bitcore-lib dependency.
Object.defineProperty(global, '_bitcore', {
  get() {
    return undefined
  }, set() {
  }
});

module.exports.Gateway = (gwDomain) => ({
  user: require('./gateway/user')(gwDomain),
  wallet: require('./gateway/wallet')(gwDomain),
  storage: require('./gateway/storage')(gwDomain),
  acl: require('./gateway/acl')(gwDomain),
  shop: require('./gateway/shop')(gwDomain),
  erc20: require('./gateway/erc20')(gwDomain),
});

module.exports.Lightwallet = {
  Keystore: require('./lightwallet/keystore'),
  Signing: require('./lightwallet/signing'),
  Web3Provider: require('./lightwallet/web3provider')
};
module.exports.MetaMask = require('./metamask');
module.exports.Web3 = require('./web3');
module.exports.Contract = {
  Profile: require('./contracts/profile')
};

module.exports.ENS = {
  FIFSRegistrar: require('./ens/FIFSRegistrar'),
  ENSRegistry: require('./ens/ENSRegistry'),
  PublicResolver: require('./ens/PublicResolver'),
  SDK: require('./ens/sdk'),
};

module.exports.EthersWallet = {
  Keystore: require('./etherswallet/keystore'),
  Web3Provider: require('./etherswallet/web3provider'),
  Account: require('./etherswallet/account'),
};