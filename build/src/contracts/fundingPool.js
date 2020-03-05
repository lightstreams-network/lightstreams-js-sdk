"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 21/11/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var fundingPoolSc = require('../../build/contracts/FundingPool.json');

module.exports.allocateFunds =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var contractAddr, artistTokenAddr, beneficiary, amount, from;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contractAddr = _ref2.contractAddr, artistTokenAddr = _ref2.artistTokenAddr, beneficiary = _ref2.beneficiary, amount = _ref2.amount, from = _ref2.from;
            Web3Wrapper.validator.validateAddress('contractAddr', contractAddr);
            Web3Wrapper.validator.validateAddress('artistTokenAddr', artistTokenAddr);
            Web3Wrapper.validator.validateAddress('beneficiary', beneficiary);
            Web3Wrapper.validator.validateWeiBn('amount', amount);
            _context.next = 7;
            return Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: false,
              method: 'allocateFunds',
              abi: fundingPoolSc.abi,
              params: [artistTokenAddr, beneficiary, amount.toString()]
            });

          case 7:
            return _context.abrupt("return", _context.sent);

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