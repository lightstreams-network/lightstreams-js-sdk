"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('web3');

var net = require('net');

var web3Utils = require('web3-utils');

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

module.exports.initialize =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(provider) {
    var options,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            return _context2.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(resolve, reject) {
                var web3;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        try {
                          web3 = new Web3(provider || defaultCfg.provider, net, {
                            defaultGasPrice: options.gasPrice || defaultCfg.gasPrice
                          });
                          resolve(web3);
                        } catch (err) {
                          reject(err);
                        }

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.getAccounts = function (web3) {
  return new Promise(function (resolve) {
    web3.eth.getAccounts().then(function (addrs) {
      resolve(addrs.map(function (addr) {
        return addr.toLowerCase();
      }));
    });
  });
};

module.exports.lockAccount = function (web3, _ref3) {
  var address = _ref3.address;
  return new Promise(function (resolve, reject) {
    if (typeof web3.eth.personal.lockAccount !== 'function') {
      reject(new Error("Not supported method"));
    }

    web3.eth.personal.lockAccount(address).then(resolve)["catch"](reject);
  });
};

module.exports.unlockAccount = function (web3, _ref4) {
  var address = _ref4.address,
      password = _ref4.password,
      duration = _ref4.duration;
  return new Promise(function (resolve, reject) {
    if (typeof web3.eth.personal.unlockAccount !== 'function') {
      reject(new Error("Not supported method"));
    }

    web3.eth.personal.unlockAccount(address, password, duration || 1000).then(resolve)["catch"](reject);
  });
};

module.exports.importAccount = function (web3, _ref5) {
  var encryptedJson = _ref5.encryptedJson,
      decryptedWallet = _ref5.decryptedWallet;

  if (typeof web3.currentProvider.importAccount !== 'function') {
    throw new Error("Not supported method");
  }

  web3.currentProvider.importAccount(encryptedJson, decryptedWallet);
};

module.exports.isAccountLocked = function (web3, _ref6) {
  var address = _ref6.address;

  if (typeof web3.currentProvider.isAccountLocked !== 'function') {
    throw new Error("Not supported method");
  }

  return web3.currentProvider.isAccountLocked(address);
};

module.exports.toWei = function (web3, pht) {
  return web3Utils.toWei(pht);
};

module.exports.isAddress = function (web3, _ref7) {
  var address = _ref7.address;
  return web3Utils.isAddress(address);
};

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