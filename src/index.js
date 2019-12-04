'use strict';

// Fix Error: More than one instance of bitcore-lib found. Please make sure to require bitcore-lib
// and check that submodules do not also include their own bitcore-lib dependency.
// Object.defineProperty(global, '_bitcore', {
//   get() {
//     return undefined
//   }, set() {
//   }
// });

module.exports.Gateway = (gwDomain) => ({
  user: require('./gateway/user')(gwDomain),
  wallet: require('./gateway/wallet')(gwDomain),
  storage: require('./gateway/storage')(gwDomain),
  acl: require('./gateway/acl')(gwDomain),
  shop: require('./gateway/shop')(gwDomain),
  erc20: require('./gateway/erc20')(gwDomain),
});

module.exports.MetaMask = require('./metamask');
module.exports.Web3 = require('./web3');
module.exports.Web3Provider = require('./web3-provider');
module.exports.Contract = {
  Profile: require('./contracts/profile'),
  ArtistToken: require('./contracts/artist_token'),
  WPHT: require('./contracts/wpht')
};

module.exports.ENS = {
  FIFSRegistrar: require('./ens/FIFSRegistrar'),
  ENSRegistry: require('./ens/ENSRegistry'),
  PublicResolver: require('./ens/PublicResolver'),
  SDK: require('./ens/sdk'),
};

module.exports.GSN = require('./gsn');

module.exports.Token = require('./token');

module.exports.EthersWallet = {
  Keystore: require('./etherswallet/keystore'),
  Account: require('./etherswallet/account'),
};
