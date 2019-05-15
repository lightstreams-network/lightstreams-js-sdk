"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 4/02/19 11:02
 * Copyright 2019 (c) Lightstreams, Palma
 */
var got = require('got');

var _require = require('../lib/response'),
    parseResponse = _require.parseResponse;

var _require2 = require('../lib/request'),
    defaultOptions = _require2.defaultOptions;

var SIGN_IN_PATH = '/user/signin';
var SIGN_UP_PATH = '/user/signup';

module.exports = function (gwDomain) {
  return {
    /**
     * Sign in a user into the system
     * @param account Account address
     * @param password The password that unlocks the account
     * @returns {Promise<{ token }>}
     */
    signIn: function () {
      var _signIn = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(account, password) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    account: account,
                    password: password
                  }
                });
                _context.next = 3;
                return got.post("".concat(gwDomain).concat(SIGN_IN_PATH), options);

              case 3:
                gwResponse = _context.sent;
                return _context.abrupt("return", parseResponse(gwResponse));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function signIn(_x, _x2) {
        return _signIn.apply(this, arguments);
      }

      return signIn;
    }(),

    /**
     * Create a new user on the gateway
     * @param password The password used to create a new Ethereum account
     * @returns {Promise<{ account }>}
     */
    signUp: function () {
      var _signUp = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(password) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    password: password
                  }
                });
                _context2.next = 3;
                return got.post("".concat(gwDomain).concat(SIGN_UP_PATH), options);

              case 3:
                gwResponse = _context2.sent;
                return _context2.abrupt("return", parseResponse(gwResponse));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function signUp(_x3) {
        return _signUp.apply(this, arguments);
      }

      return signUp;
    }()
  };
};