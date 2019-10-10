"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * User: ggarrido
 * Date: 9/10/19 18:06
 * Copyright 2019 (c) Lightstreams, Granada
 */
var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');

module.exports = function WalletSubprovider(provider) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new HookedWalletSubprovider({
    getAccounts: opts.getAccounts || function (cb) {
      var addresses = provider._getAccounts();

      cb(null, addresses);
    },
    signMessage: opts.signMessage || function (payload, cb) {
      try {
        var from = payload.from,
            data = payload.data;

        var account = provider._getAccount(from);

        account.signMsg({
          data: data,
          chainId: provider.chainId()
        }, cb);
      } catch (err) {
        if (typeof cb === 'function') cb(err, '0x0');else throw err;
      }
    },
    signTransaction: opts.signTransaction || function (payload, cb) {
      try {
        var gas = payload.gas,
            from = payload.from,
            params = _objectWithoutProperties(payload, ["gas", "from"]);

        var txParams = _objectSpread({}, params, {
          gasLimit: gas
        });

        var account = provider._getAccount(from);

        account.signTx(_objectSpread({}, txParams, {
          chainId: provider.chainId()
        }), cb);
      } catch (err) {
        if (typeof cb === 'function') cb(err, '0x0');else throw err;
      }
    }
  });
};