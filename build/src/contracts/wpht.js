"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 21/11/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var wphtSc = require('../../build/contracts/WPHT.json');

module.exports.getWPHTBalanceOf =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref) {
    var wphtAddr, accountAddr, balance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wphtAddr = _ref.wphtAddr, accountAddr = _ref.accountAddr;
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);
            _context.next = 5;
            return Web3Wrapper.contractCall(web3, {
              to: wphtAddr,
              useGSN: false,
              method: 'balanceOf',
              abi: wphtSc.abi,
              params: [accountAddr]
            });

          case 5:
            balance = _context.sent;
            console.log("Account ".concat(accountAddr, " has ").concat(Web3Wrapper.utils.wei2pht(balance.toString()), " WPHT"));
            return _context.abrupt("return", Web3Wrapper.utils.toBN(balance));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();