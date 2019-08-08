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

var waitFor = function waitFor(waitInSeconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

var fetchTxReceipt =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, txHash, expiredAt) {
    var receipt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return web3.eth.getTransactionReceipt(txHash);

          case 2:
            receipt = _context.sent;

            if (!(!receipt && new Date().getTime() < expiredAt)) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return waitFor(0.5);

          case 6:
            return _context.abrupt("return", fetchTxReceipt(web3, txHash, expiredAt));

          case 7:
            return _context.abrupt("return", receipt);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchTxReceipt(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

if (typeof web3 === 'undefined') {
  web3 = null;
}

module.exports = {
  initialize: function () {
    var _initialize = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(provider) {
      var options,
          _args3 = arguments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              return _context3.abrupt("return", new Promise(
              /*#__PURE__*/
              function () {
                var _ref2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(resolve, reject) {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (typeof web3 === 'undefined') {
                            try {
                              web3 = new Web3(provider || defaultCfg.provider, net, {
                                defaultGasPrice: options.gasPrice || defaultCfg.gasPrice
                              });
                            } catch (err) {
                              reject(err);
                            }
                          }

                          resolve(web3);

                        case 2:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x5, _x6) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function initialize(_x4) {
      return _initialize.apply(this, arguments);
    }

    return initialize;
  }(),
  getTxReceipt: function getTxReceipt(txHash) {
    var timeoutInSec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
    return new Promise(function (resolve, reject) {
      if (typeof web3 === 'undefined') {
        reject('Web3 was not initialized');
      }

      fetchTxReceipt(web3, txHash, new Date().getTime() + timeoutInSec * 1000).then(function (receipt) {
        if (!receipt) {
          reject();
        }

        resolve(receipt);
      });
    });
  },
  sendRawTransaction: function sendRawTransaction(rawSignedTx) {
    return new Promise(function (resolve, reject) {
      if (typeof web3 === 'undefined') {
        reject('Web3 was not initialized');
      }

      web3.eth.sendSignedTransaction(rawSignedTx, function (err, hash) {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  }
};