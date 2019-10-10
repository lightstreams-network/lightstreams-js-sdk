"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('web3');

var net = require('net');

var latest = require('./latest');

var v0_20 = require('./v0_20');

var isLatest = function isLatest(web3) {
  return typeof web3.version === 'string' && web3.version.indexOf('1.') === 0;
};

var isV0_20 = function isV0_20(web3) {
  return _typeof(web3.version) === 'object' && web3.version.api.indexOf('0.20') === 0;
};

var defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000
};

module.exports.newEngine = function (provider) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof provider === 'string') {
    var Web3Provider = require('../web3-provider'); // @ISSUE when imported top due to recursive dependency


    console.log(Web3Provider);
    provider = Web3Provider(_objectSpread({}, options, {
      rpcUrl: provider
    }));
  }

  return new Web3(provider || defaultCfg.provider, net, {
    defaultGasPrice: options.gasPrice || defaultCfg.gasPrice
  });
};

module.exports.keystore = require('./addon/keystore');
module.exports.utils = require('./addon/utils');
[].concat(_toConsumableArray(Object.keys(latest)), _toConsumableArray(Object.keys(isV0_20))).forEach(function (method) {
  module.exports[method] = function (web3, payload) {
    var methodCall;

    if (isLatest(web3)) {
      methodCall = latest[method];
    } else if (isV0_20(web3)) {
      methodCall = v0_20[method];
    } else {
      throw new Error("Not support web3js version");
    }

    if (typeof methodCall === 'function') {
      return methodCall(web3, payload);
    } else {
      throw new Error("Not implemented method ".concat(method, "()"));
    }
  };
});