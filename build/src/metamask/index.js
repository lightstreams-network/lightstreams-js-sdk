"use strict";

var _this = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * User: ggarrido
 * Date: 14/08/19 9:49
 * Copyright 2019 (c) Lightstreams, Granada
 */
var WalletSubprovider = require('../web3-provider/subproviders/wallet');

var Web3Provider = require('../web3-provider');

var Web3 = require('../web3');

module.exports.isInstalled = function () {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

module.exports.isConnected = function () {
  return _this.isInstalled() && typeof window.web3 !== 'undefined' && window.web3.isConnected();
};

module.exports.isEnabled = function () {
  return _this.isConnected() && typeof window.ethereum.selectedAddress !== 'undefined';
};

module.exports.enable = function () {
  return window.ethereum.enable();
};

module.exports.selectedAddress = function () {
  if (!_this.isConnected()) {
    throw new Error('Web3 is not connected');
  }

  return window.ethereum.selectedAddress;
};

module.exports.web3 = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var providerEngine = window.web3;
  var selectedAddr = window.ethereum.selectedAddress.toLowerCase();

  if (!opts.rpcUrl) {
    throw new Error("Missing option \"rpcUrl\"");
  }

  var walletSubprovider = WalletSubprovider({
    getAccounts: function getAccounts(cb) {
      providerEngine.eth.getAccounts(cb);
    },
    signMessage: function signMessage(payload, cb) {
      try {
        var from = payload.from,
            data = payload.data;

        if (from.toLowerCase() !== selectedAddr) {
          cb(new Error("Selected metamask address is not expected ".concat(from)), null);
        } // providerEngine.sign(web3.toHex("msg"), web3.eth.defaultAccount, (err, res) => console.log(err, res))


        providerEngine.personal.sign(data, from, function (err, res) {
          cb(err, res);
        });
      } catch (err) {
        if (typeof cb === 'function') cb(err, '0x0');else throw err;
      }
    },
    signTransaction: function signTransaction(payload, cb) {
      try {
        var gas = payload.gas,
            from = payload.from,
            params = _objectWithoutProperties(payload, ["gas", "from"]);

        var txParams = _objectSpread({}, params, {
          gasLimit: gas
        });

        if (from.toLowerCase() !== selectedAddr) {
          cb(new Error("Selected metamask address is not expected ".concat(from)), null);
        }

        providerEngine.personal.signTransaction(txParams, from, function (err, res) {
          cb(err, res);
        });
      } catch (err) {
        if (typeof cb === 'function') cb(err, '0x0');else throw err;
      }
    }
  });
  var provider = Web3Provider({
    rpcUrl: opts.rpcUrl
  }, walletSubprovider);
  return Web3.newEngine(provider);
}; // web3.personal.sign(web3.toHex("msg"), web3.eth.defaultAccount, (err, res) => console.log(err, res))
// web3.currentProvider.networkVersion
// window.ethereum.selectedAddress