"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

module.exports.initialize =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
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
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(resolve, reject) {
                var web3;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        try {
                          web3 = new Web3(provider || defaultCfg.provider, net, {
                            defaultGasPrice: options.gasPrice || defaultCfg.gasPrice
                          });
                          resolve(web3);
                        } catch (err) {
                          reject(err);
                        }

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports.networkVersion = function (web3) {
  return new Promise(function (resolve, reject) {
    web3.eth.net.getId(function (err, netId) {
      if (err) reject(err);
      resolve(netId);
    });
  });
};

module.exports.getTxReceipt = function (web3, txHash) {
  var timeoutInSec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
  return new Promise(function (resolve, reject) {
    fetchTxReceipt(web3, txHash, new Date().getTime() + timeoutInSec * 1000).then(function (receipt) {
      if (!receipt) {
        reject();
      }

      resolve(receipt);
    });
  });
};

module.exports.getBalance = function (web3, address) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(resolve, reject) {
      var balance;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return web3.eth.getBalance(address);

            case 3:
              balance = _context4.sent;
              resolve(balance);
              _context4.next = 10;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              reject(_context4.t0);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 7]]);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
};

module.exports.sendRawTransaction = function (web3, rawSignedTx) {
  return new Promise(function (resolve, reject) {
    web3.eth.sendSignedTransaction(rawSignedTx, function (err, hash) {
      if (err) {
        reject(err);
      }

      resolve(hash);
    });
  });
};

module.exports.sendTransaction = function (web3, _ref5) {
  var to = _ref5.to,
      value = _ref5.value;
  throw new Exception('Missing implementation');
};

module.exports.contractCall = function (web3, _ref6) {
  var abi = _ref6.abi,
      address = _ref6.address,
      method = _ref6.method,
      params = _ref6.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(resolve, reject) {
      var _contract$methods, contract, result;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              contract = new web3.eth.Contract(abi, address);
              _context5.next = 4;
              return (_contract$methods = contract.methods)[method].apply(_contract$methods, _toConsumableArray(params)).call({
                from: address
              });

            case 4:
              result = _context5.sent;
              resolve(result);
              _context5.next = 11;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](0);
              reject(_context5.t0);

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 8]]);
    }));

    return function (_x9, _x10) {
      return _ref7.apply(this, arguments);
    };
  }());
};

module.exports.deployContract = function (web3, _ref8) {
  var abi = _ref8.abi,
      bytecode = _ref8.bytecode,
      params = _ref8.params;
  throw new Exception('Missing implementation');
};

module.exports.contractSendTransaction = function (web3, _ref9) {
  var abi = _ref9.abi,
      address = _ref9.address,
      method = _ref9.method,
      params = _ref9.params;
  throw new Exception('Missing implementation');
};