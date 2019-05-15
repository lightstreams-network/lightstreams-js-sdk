"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 14/05/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var got = require('got');

var _require = require('../lib/response'),
    parseResponse = _require.parseResponse,
    errorResponse = _require.errorResponse;

var _require2 = require('../lib/request'),
    defaultOptions = _require2.defaultOptions;

var CREATE_SHOP_PATH = '/shop/create';
var SELL_PATH = '/shop/sell';
var BUY_PATH = '/shop/buy';
var PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports = function (gwDomain) {
  return {
    /**
     * Creates an online shop, smart contract, for selling/buying digital content
     * @param from Shop owner account address
     * @param password The password that unlocks the from account
     * @returns {Promise<{ shop }>} Shop contract address
     */
    create: function () {
      var _create = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(from, password) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    from: from,
                    password: password
                  }
                });
                _context.next = 3;
                return got.post("".concat(gwDomain).concat(CREATE_SHOP_PATH), options);

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

      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }

      return create;
    }(),

    /**
     * Puts an ACL permission to digital content for sale in owner's online shop
     * @param shop shop contract address
     * @param from Shop owner account address
     * @param password The password that unlocks the from account
     * @param acl acl contract address of file intended to sell
     * @param priceWei price in wei buyers must pay to get read access to the file
     * @returns {Promise<{ success }>} true or false
     */
    sell: function () {
      var _sell = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(shop, from, password, acl, priceWei) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    shop: shop,
                    from: from,
                    password: password,
                    acl: acl,
                    price_wei: priceWei
                  }
                });
                _context2.next = 3;
                return got.post("".concat(gwDomain).concat(SELL_PATH), options);

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

      function sell(_x3, _x4, _x5, _x6, _x7) {
        return _sell.apply(this, arguments);
      }

      return sell;
    }(),

    /**
     * Buys the ACL Read Permission to digital content from owner's online shop
     * @param shop shop contract address
     * @param from Shop owner account address
     * @param password The password that unlocks the from account
     * @param acl acl contract address of file intended to sell
     * @returns {Promise<{ success }>} true or false
     */
    buy: function () {
      var _buy = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(shop, from, password, acl) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    shop: shop,
                    from: from,
                    password: password,
                    acl: acl
                  }
                });
                _context3.next = 3;
                return got.post("".concat(gwDomain).concat(BUY_PATH), options);

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

      function buy(_x8, _x9, _x10, _x11) {
        return _buy.apply(this, arguments);
      }

      return buy;
    }()
  };
};