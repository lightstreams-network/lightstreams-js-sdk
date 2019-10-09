"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ethers = require('ethers');

var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');

var SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions');

var NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');

var FilterSubprovider = require('web3-provider-engine/subproviders/filters');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

var ProviderEngine = require('./engine');

var _require = require('./subproviders'),
    PersonalSubprovider = _require.PersonalSubprovider,
    GsnSubprovider = _require.GsnSubprovider,
    WalletSubprovider = _require.WalletSubprovider; // @TODO Decouple from etherswallet module


module.exports = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var rpcUrl = opts.rpcUrl,
      useGSN = opts.useGSN,
      verbose = opts.verbose,
      engineOpts = _objectWithoutProperties(opts, ["rpcUrl", "useGSN", "verbose"]);

  var lsProviderEngine = new ProviderEngine(engineOpts);
  var version = '0.8.0';
  var jsonProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  jsonProvider.send('net_version').then(function (version) {
    chainId = parseInt(version); // The possible `hardfork` parameter values
    // - `Byzantium`
    // - `Constantinople`
    // - `Petersburg`

    switch (chainId) {
      case 161:
        lsProviderEngine.setNetwork({
          name: 'standalone',
          networkId: chainId,
          chainId: chainId
        });
        break;

      case 162:
        lsProviderEngine.setNetwork({
          name: 'sirius',
          networkId: chainId,
          chainId: chainId
        });
        break;

      case 163:
        lsProviderEngine.setNetwork({
          name: 'mainnet',
          networkId: chainId,
          chainId: chainId
        });
        break;

      default:
        lsProviderEngine.setNetwork({
          name: 'unknown',
          networkId: chainId,
          chainId: chainId
        });
    }
  });
  lsProviderEngine.host = rpcUrl;
  lsProviderEngine.addProvider(new FixtureSubprovider({
    web3_clientVersion: "Lightstreams/v".concat(version, "/javascript"),
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true
  }));
  lsProviderEngine.addProvider(new SubscriptionsSubprovider());
  lsProviderEngine.addProvider(new FilterSubprovider());
  lsProviderEngine.addProvider(new NonceSubprovider());
  lsProviderEngine.addProvider(new GsnSubprovider(lsProviderEngine, {
    useGSN: useGSN || false,
    verbose: verbose || false,
    jsonRpcSend: jsonProvider.send.bind(jsonProvider)
  }));
  lsProviderEngine.addProvider(WalletSubprovider(lsProviderEngine));
  lsProviderEngine.addProvider(new PersonalSubprovider(lsProviderEngine));
  lsProviderEngine.addProvider(new RpcSubprovider({
    rpcUrl: rpcUrl // Expected to be

  })); // network connectivity error

  lsProviderEngine.on('error', function (err) {
    // report connectivity errors
    console.error(err.stack);
  }); // start polling for blocks

  lsProviderEngine.start();
  return lsProviderEngine;
};