"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 21/11/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var Debug = require('debug');

var wphtSc = require('../../build/contracts/WPHT.json');

var fundingPoolSc = require('../../build/contracts/FundingPool.json');

var logger = Debug('ls-sdk:contract:wpht');

module.exports.getWPHTBalanceOf =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var wphtAddr, accountAddr, balance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wphtAddr = _ref2.wphtAddr, accountAddr = _ref2.accountAddr;
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
            logger("Account ".concat(accountAddr, " has ").concat(Web3Wrapper.utils.wei2pht(balance.toString()), " WPHT"));
            return _context.abrupt("return", Web3Wrapper.utils.toBN(balance));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.deposit =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref4) {
    var from, wphtAddr, amountInPht;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref4.from, wphtAddr = _ref4.wphtAddr, amountInPht = _ref4.amountInPht;
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            _context2.next = 4;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: wphtAddr,
              method: 'deposit',
              abi: wphtSc.abi,
              value: Web3Wrapper.utils.toWei(amountInPht)
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports.deployFundingPool =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref6) {
    var from, wphtAddr, owner;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            from = _ref6.from, wphtAddr = _ref6.wphtAddr, owner = _ref6.owner;
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            _context3.next = 4;
            return Web3Wrapper.deployContract(web3, {
              from: from,
              abi: fundingPoolSc.abi,
              bytecode: fundingPoolSc.bytecode,
              params: [wphtAddr, owner || from]
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();