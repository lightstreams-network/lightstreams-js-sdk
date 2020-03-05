"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ethers = require('ethers');

var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

var SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions');

var NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');

var FilterSubprovider = require('web3-provider-engine/subproviders/filters');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

var ProviderEngine = require('./engine');

var _require = require('./subproviders'),
    PersonalSubprovider = _require.PersonalSubprovider,
    GsnSubprovider = _require.GsnSubprovider,
    WalletSubprovider = _require.WalletSubprovider;

module.exports = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var walletSubprovider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var rpcUrl = opts.rpcUrl,
      useRemoteKeystore = opts.useRemoteKeystore,
      engineOpts = _objectWithoutProperties(opts, ["rpcUrl", "useRemoteKeystore"]);

  var lsProviderEngine = new ProviderEngine(engineOpts);
  var version = '0.8.0'; // @TODO Decouple from etherswallet module

  var jsonProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  jsonProvider.send('net_version').then(function (version) {
    chainId = parseInt(version);

    switch (chainId) {
      case 161:
        lsProviderEngine.setNetwork({
          name: 'standalone',
          networkId: chainId,
          chainId: chainId,
          hardfork: 'constantinople'
        });
        break;

      case 162:
        lsProviderEngine.setNetwork({
          name: 'sirius',
          networkId: chainId,
          chainId: chainId,
          hardfork: 'petersburg'
        });
        break;

      case 163:
        lsProviderEngine.setNetwork({
          name: 'mainnet',
          networkId: chainId,
          chainId: chainId,
          hardfork: 'petersburg'
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
  lsProviderEngine.addProvider(new GsnSubprovider(lsProviderEngine, _objectSpread({
    useGSN: false
  }, engineOpts, {
    jsonRpcSend: jsonProvider.send.bind(jsonProvider)
  })));

  if (!walletSubprovider) {
    // Initialize default wallet subprovider using in memory wallets
    walletSubprovider = WalletSubprovider({
      getAccounts: function getAccounts(cb) {
        var addresses = lsProviderEngine._getAccounts();

        cb(null, addresses);
      },
      signMessage: function signMessage(payload, cb) {
        try {
          var from = payload.from,
              data = payload.data;

          var account = lsProviderEngine._getAccount(from);

          account.signMsg({
            data: data,
            chainId: lsProviderEngine._getChainId()
          }, cb);
        } catch (err) {
          if (typeof cb === 'function') cb(err, '0x0');else throw err;
        }
      },
      signTransaction: function signTransaction(payload, cb) {
        try {
          var gas = payload.gas,
              from = payload.from,
              useGSN = payload.useGSN,
              params = _objectWithoutProperties(payload, ["gas", "from", "useGSN"]);

          var txParams = _objectSpread({}, params, {
            gasLimit: gas
          });

          var account = lsProviderEngine._getAccount(from);

          account.signTx(_objectSpread({}, txParams, {
            chainId: lsProviderEngine._getChainId()
          }), cb);
        } catch (err) {
          if (typeof cb === 'function') cb(err, '0x0');else throw err;
        }
      }
    });
  }

  if (!useRemoteKeystore) {
    lsProviderEngine.addProvider(walletSubprovider);
    lsProviderEngine.addProvider(new PersonalSubprovider(lsProviderEngine));
  }

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