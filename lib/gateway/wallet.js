"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var got = require('got');

var _require = require('../lib/response'),
    parseResponse = _require.parseResponse;

var _require2 = require('../lib/request'),
    defaultOptions = _require2.defaultOptions;

var WALLET_BALANCE_PATH = '/wallet/balance';
var WALLET_TRANSFER_PATH = '/wallet/transfer';

module.exports = function (gwDomain) {
  return {
    /**
     * Get wallet balance from an account
     * @param account Account address
     * @returns {Promise<{ balance }>}
     */
    balance: function () {
      var _balance = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(account) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  query: {
                    account: account
                  }
                });
                _context.next = 3;
                return got.get("".concat(gwDomain).concat(WALLET_BALANCE_PATH), options);

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

      function balance(_x) {
        return _balance.apply(this, arguments);
      }

      return balance;
    }(),

    /**
     * Transfer funds to an account
     * @param from Account address to transfer funds from
     * @param password The password that unlocks the account
     * @param to Account address to transfer funds to
     * @param amountWei Amount in wei
     * @returns {Promise<{ balance }>} Remaining balance on from account
     */
    transfer: function () {
      var _transfer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(from, password, to, amountWei) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    from: from,
                    password: password,
                    to: to,
                    amount_wei: amountWei.toString()
                  }
                });
                _context2.next = 3;
                return got.post("".concat(gwDomain).concat(WALLET_TRANSFER_PATH), options);

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

      function transfer(_x2, _x3, _x4, _x5) {
        return _transfer.apply(this, arguments);
      }

      return transfer;
    }()
  };
};