"use strict";

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 21/11/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var wphtSc = require('../../build/contracts/WPHT.json');

var fundingPoolSc = require('../../build/contracts/FundingPool.json');

module.exports.getWPHTBalanceOf = function _callee(web3, _ref) {
  var wphtAddr, accountAddr, balance;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          wphtAddr = _ref.wphtAddr, accountAddr = _ref.accountAddr;
          Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
          Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);
          _context.next = 5;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: wphtAddr,
            useGSN: false,
            method: 'balanceOf',
            abi: wphtSc.abi,
            params: [accountAddr]
          }));

        case 5:
          balance = _context.sent;
          console.log("Account ".concat(accountAddr, " has ").concat(Web3Wrapper.utils.wei2pht(balance.toString()), " WPHT"));
          return _context.abrupt("return", Web3Wrapper.utils.toBN(balance));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.deposit = function _callee2(web3, _ref2) {
  var from, wphtAddr, amountInPht;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          from = _ref2.from, wphtAddr = _ref2.wphtAddr, amountInPht = _ref2.amountInPht;
          Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
          _context2.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: wphtAddr,
            method: 'deposit',
            abi: wphtSc.abi,
            value: Web3Wrapper.utils.toWei(amountInPht)
          }));

        case 4:
          return _context2.abrupt("return", _context2.sent);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.deployFundingPool = function _callee3(web3, _ref3) {
  var from, wphtAddr, owner;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          from = _ref3.from, wphtAddr = _ref3.wphtAddr, owner = _ref3.owner;
          Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
          _context3.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.deployContract(web3, {
            from: from,
            abi: fundingPoolSc.abi,
            bytecode: fundingPoolSc.bytecode,
            params: [wphtAddr, owner || from]
          }));

        case 4:
          return _context3.abrupt("return", _context3.sent);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};