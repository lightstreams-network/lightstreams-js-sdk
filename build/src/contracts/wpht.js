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

module.exports.deployContract = function (web3, _ref) {
  var from = _ref.from;
  return Web3Wrapper.deployContract(web3, {
    from: from,
    abi: wphtSc.abi,
    bytecode: wphtSc.bytecode,
    params: []
  });
};

module.exports.getWPHTBalanceOf =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref3) {
    var wphtAddr, accountAddr, balance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wphtAddr = _ref3.wphtAddr, accountAddr = _ref3.accountAddr;
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
            return _context.abrupt("return", Web3Wrapper.utils.toBN(balance));

          case 7:
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

module.exports.deposit =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref5) {
    var from, wphtAddr, amountInPht;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref5.from, wphtAddr = _ref5.wphtAddr, amountInPht = _ref5.amountInPht;
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
    return _ref4.apply(this, arguments);
  };
}();

module.exports.deployFundingPool =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref7) {
    var from, wphtAddr, owner;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            from = _ref7.from, wphtAddr = _ref7.wphtAddr, owner = _ref7.owner;
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
    return _ref6.apply(this, arguments);
  };
}();