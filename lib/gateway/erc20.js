"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 4/02/19 11:22
 * Copyright 2019 (c) Lightstreams, Palma
 */
var got = require('got');

var _require = require('../lib/response'),
    parseResponse = _require.parseResponse;

var _require2 = require('../lib/request'),
    defaultOptions = _require2.defaultOptions;

var ERC20_BALANCE_PATH = "/erc20/balance";
var ERC20_TRANSFER_PATH = "/erc20/transfer";
var ERC20_PURCHASE_PATH = "/erc20/purchase";

module.exports = function (gwDomain) {
  return {
    /**
     * Get balance of any erc20 token
     * @param erc20_address Address of the erc20 token contract
     * @param account Account address for which to check the balance
     * @returns {Promise<{ balance }>}
     */
    balance: function () {
      var _balance = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(erc20_address, account) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  query: {
                    erc20_address: erc20_address,
                    account: account
                  }
                });
                _context.next = 3;
                return got.get("".concat(gwDomain).concat(ERC20_BALANCE_PATH), options);

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

      function balance(_x, _x2) {
        return _balance.apply(this, arguments);
      }

      return balance;
    }(),

    /**
     * Transfer erc20 token to an account
     * @param erc20_address ERC20 token address
     * @param from Account address to transfer funds from
     * @param password The password that unlocks the account
     * @param to Account address to transfer funds to
     * @param amount Amount in erc20 token
     * @returns {Promise<*>}
     */
    transfer: function () {
      var _transfer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(erc20_address, from, password, to, amount) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    erc20_address: erc20_address,
                    from: from,
                    password: password,
                    to: to,
                    amount: amount.toString()
                  }
                });
                _context2.next = 3;
                return got.post("".concat(gwDomain).concat(ERC20_TRANSFER_PATH), options);

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

      function transfer(_x3, _x4, _x5, _x6, _x7) {
        return _transfer.apply(this, arguments);
      }

      return transfer;
    }(),

    /**
     * Sending tokens to ICO contract and purchase tokens
     * @param erc20_address ERC20 token address
     * @param account Account address to transfer funds from
     * @param password The password that unlocks the account
     * @param amount_wei Amount in wei to purchase
     * @returns {Promise<{ tokens }>}
     */
    purchase: function () {
      var _purchase = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(erc20_address, account, password, amount_wei) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    erc20_address: erc20_address,
                    password: password,
                    account: account,
                    amount_wei: amount_wei.toString()
                  }
                });
                _context3.next = 3;
                return got.post("".concat(gwDomain).concat(ERC20_PURCHASE_PATH), options);

              case 3:
                gwResponse = _context3.sent;
                return _context3.abrupt("return", parseResponse(gwResponse));

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function purchase(_x8, _x9, _x10, _x11) {
        return _purchase.apply(this, arguments);
      }

      return purchase;
    }()
  };
};