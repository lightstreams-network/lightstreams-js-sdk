"use strict";

var _this = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ethers = require('ethers');

var Util = require('ethereumjs-util');

var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

var ProviderEngine = require('web3-provider-engine');

var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');

var SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions');

var NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');

var FilterSubprovider = require('web3-provider-engine/subproviders/filters');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

var _require = require('./subproviders'),
    PersonalSubprovider = _require.PersonalSubprovider;

module.exports = function (_ref) {
  var rpcUrl = _ref.rpcUrl,
      accounts = _ref.accounts;
  var engine = new ProviderEngine();
  var version = '0.0.1';
  var wallets = {};
  (accounts || []).forEach(function (account) {
    wallets[account.address] = account;
  });
  var network;
  var jsonProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  jsonProvider.send('net_version').then(function (version) {
    chainId = parseInt(version); // The second parameter is not necessary if these values are used
    // - `Byzantium`
    // - `Constantinople`
    // - `Petersburg`

    switch (chainId) {
      case 161:
        network = {
          name: 'standalone',
          networkId: chainId,
          chainId: chainId
        };
        break;

      case 162:
        network = {
          name: 'sirius',
          networkId: chainId,
          chainId: chainId
        };
        break;

      case 163:
        network = {
          name: 'mainnet',
          networkId: chainId,
          chainId: chainId
        };
        break;

      default:
        throw new Error("Unsupported chainId ".concat(version));
    }
  }); // Copyrights to @Portis team
  // https://github.com/portis-project/web-sdk/blob/master/packages/portis-web3/src/index.ts

  engine.send = function (payload, callback) {
    // Web3 1.0 beta.38 (and above) calls `send` with method and parameters
    if (typeof payload === 'string') {
      return new Promise(function (resolve, reject) {
        engine.sendAsync({
          jsonrpc: '2.0',
          id: 42,
          method: payload,
          params: callback || []
        }, function (error, response) {
          if (error) {
            reject(error);
          } else {
            resolve(response.result);
          }
        });
      });
    } // Web3 1.0 beta.37 (and below) uses `send` with a callback for async queries


    if (callback) {
      engine.sendAsync(payload, callback);
      return;
    }

    var result = null;

    switch (payload.method) {
      case 'eth_accounts':
        result = _this._selectedAddress ? [_this._selectedAddress] : [];
        break;

      case 'eth_coinbase':
        result = _this._selectedAddress ? [_this._selectedAddress] : [];
        break;

      case 'net_version':
        result = _this._network;
        break;

      case 'eth_uninstallFilter':
        engine.sendAsync(payload, function (_) {
          return _;
        });
        result = true;
        break;

      default:
        var message = "The Portis Web3 object does not support synchronous methods like ".concat(payload.method, " without a callback parameter.");
        throw new Error(message);
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result: result
    };
  };

  engine.addProvider(new FixtureSubprovider({
    web3_clientVersion: "Lightstreams/v".concat(version, "/javascript"),
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true
  }));
  engine.addProvider(new SubscriptionsSubprovider());
  engine.addProvider(new FilterSubprovider());
  engine.addProvider(new NonceSubprovider());
  engine.addProvider(new HookedWalletSubprovider({
    getAccounts: function getAccounts(cb) {
      var addresses = Object.keys(wallets);
      cb(null, addresses);
    },
    signTransaction: function signTransaction(payload, cb) {
      try {
        var gas = payload.gas,
            from = payload.from,
            params = _objectWithoutProperties(payload, ["gas", "from"]);

        var txParams = _objectSpread({}, params, {
          gasLimit: gas
        });

        var account = wallets[from];
        account.signTx(_objectSpread({}, txParams, {
          chainId: network.chainId
        }), cb);
      } catch (err) {
        if (typeof cb === 'function') cb(err, '0x0');else throw err;
      }
    }
  })); // engine.addProvider(new PersonalSubprovider({ wallets }));

  engine.addProvider(new RpcSubprovider({
    rpcUrl: rpcUrl // Expected to be

  })); // network connectivity error

  engine.on('error', function (err) {
    // report connectivity errors
    console.error(err.stack);
  });

  engine.appendAccount = function (account) {
    wallets[account.address] = account;
  };

  engine.getAccount = function (address) {
    address = Util.addHexPrefix(address).toLowerCase();

    if (typeof wallets[address] === 'undefined') {
      throw new Error("Address ".concat(address, " is not found."));
    }

    return wallets[address];
  }; // start polling for blocks


  engine.start();
  return engine;
};