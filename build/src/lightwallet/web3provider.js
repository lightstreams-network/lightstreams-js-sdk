"use strict";

/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ProviderEngine = require('web3-provider-engine'); // const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
// const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
// const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
// const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')


var SubscriptionsSubProvider = require('web3-provider-engine/subproviders/subscriptions');

var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');

var NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

module.exports.HookedWeb3Provider = function (ksVault, pwDerivedKey, _ref) {
  var host = _ref.host;
  var engine = new ProviderEngine(); //   // static results
  //   engine.addProvider(new FixtureSubprovider({
  //     web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  //   }));
  //
  // // cache layer
  //   engine.addProvider(new CacheSubprovider());
  //
  // filters
  //   engine.addProvider(new FilterSubprovider());
  // subscription

  engine.addProvider(new SubscriptionsSubProvider()); // pending nonce

  engine.addProvider(new NonceSubprovider()); // vm
  //   engine.addProvider(new VmSubprovider());

  engine.addProvider(new HookedWalletSubprovider({
    getAccounts: function getAccounts(cb) {
      var Keystore = require('./keystore');

      var accounts = Keystore.addresses(ksVault);
      cb(null, accounts);
    },
    // approveTransaction: function(cb) {
    //   debugger;
    // },
    signTransaction: function signTransaction(payload, cb) {
      // debugger;
      // ksVault.signTransaction(payload, (err, signedTx) => {
      //   cb(err, signedTx);
      // });
      try {
        var Signing = require('./signing');

        var signedRawTx = Signing.signRawTx(ksVault, pwDerivedKey, payload);
        cb(null, signedRawTx);
      } catch (err) {
        cb(err, '0x0');
      }
    }
  }));
  engine.addProvider(new RpcSubprovider({
    rpcUrl: host
  })); // // log new blocks
  //   engine.on('block', function(block) {
  //     console.log('================================')
  //     console.log('BLOCK CHANGED:', '#' + block.number.toString('hex'), '0x' + block.hash.toString('hex'))
  //     console.log('================================')
  //   })
  // network connectivity error

  engine.on('error', function (err) {
    // report connectivity errors
    console.error(err.stack);
  }); // start polling for blocks

  engine.start();
  return engine;
};