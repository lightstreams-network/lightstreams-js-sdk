"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 5/08/19 15:45
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('web3');

var net = require('net');

var defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000
};
var web3;
module.exports =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var _ref2,
      provider,
      gasPrice,
      _args = arguments;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, provider = _ref2.provider, gasPrice = _ref2.gasPrice;

          if (!(typeof web3 === 'undefined')) {
            _context.next = 10;
            break;
          }

          _context.prev = 2;
          web3 = new Web3(provider || defaultCfg.provider, net, {
            defaultGasPrice: gasPrice || defaultCfg.gasPrice
          });
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](2);
          console.error(_context.t0);
          return _context.abrupt("return", null);

        case 10:
          return _context.abrupt("return", web3);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[2, 6]]);
}));

module.exports.web3SendTx = function (web3, _ref3, txCall) {
  var from = _ref3.from,
      password = _ref3.password;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return new Promise(function (resolve, reject) {
    web3.eth.personal.unlockAccount(from, password, 100).then(function () {
      txCall().send(options).on('transactionHash', function (transactionHash) {
        console.log("Transaction Executed: ".concat(transactionHash));
      }).on('confirmation', function (confirmationNumber, txReceipt) {
        web3.eth.personal.lockAccount(cfg.from);

        if (typeof txReceipt.status !== 'undefined') {
          if (txReceipt.status === true || txReceipt.status === '0x1') {
            console.log('Transaction succeeded!');
            resolve(txReceipt);
          } else {
            console.error('Transaction failed!');
            reject(new Error('Transaction failed'));
          }
        } else {
          resolve(txReceipt);
        }
      }).on('error', function (err) {
        web3.eth.personal.lockAccount(from);
        console.error(err);
        reject(err);
      }).catch(function (err) {
        console.error(err);
        reject(err);
      });
    }).catch(function (err) {
      console.error(err);
      reject(err);
    });
  });
};