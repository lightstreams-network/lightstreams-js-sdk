"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Debug = require('debug');

var Web3 = require('web3');

var net = require('net');

var _require = require('./helpers'),
    fetchTxReceipt = _require.fetchTxReceipt,
    calculateEstimatedGas = _require.calculateEstimatedGas,
    isLatest = _require.isLatest,
    FailedTxError = _require.FailedTxError;

var logger = Debug('ls-sdk:web3');
var defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000
};

module.exports.newEngine = function (provider) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof provider === 'string' && !options.useRemoteKeystore) {
    var Web3Provider = require('../web3-provider'); // @TODO Resolve recursive dependency if imported in headers


    provider = Web3Provider(_objectSpread({}, options, {
      rpcUrl: provider
    }));
  }

  return new Web3(provider || defaultCfg.provider, net, {
    defaultGasPrice: options.gasPrice || defaultCfg.gasPrice
  });
};

var getTxReceipt = module.exports.getTxReceipt = function (web3, _ref) {
  var txHash = _ref.txHash,
      timeoutInSec = _ref.timeoutInSec;
  return new Promise(function (resolve, reject) {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
    fetchTxReceipt(web3, txHash, new Date().getTime() + (timeoutInSec || 15) * 1000).then(function (receipt) {
      if (!receipt) reject(new Error("Cannot fetch tx receipt ".concat(txHash)));else resolve(receipt);
    })["catch"](reject);
  });
};

module.exports.sendRawTransaction = function (web3, rawSignedTx) {
  return new Promise(function (resolve, reject) {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
    web3.eth.sendSignedTransaction(rawSignedTx, function (err, txHash) {
      if (err) reject(err);
      getTxReceipt(web3, {
        txHash: txHash
      }).then(function (txReceipt) {
        if (!txReceipt.status) reject(FailedTxError(txReceipt));else resolve(txReceipt);
      })["catch"](reject);
    });
  });
};

module.exports.sendTransaction = function (web3, _ref2) {
  var from = _ref2.from,
      to = _ref2.to,
      valueInPht = _ref2.valueInPht;
  return new Promise(function (resolve, reject) {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
    web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(valueInPht, "ether")
    }).on('transactionHash', function (txHash) {
      getTxReceipt(web3, {
        txHash: txHash
      }).then(function (txReceipt) {
        if (!txReceipt.status) reject(FailedTxError(txReceipt));else resolve(txReceipt);
      })["catch"](reject);
    }).on('error', reject);
  });
};

module.exports.contractCall = function (web3, _ref3) {
  var contractAddr = _ref3.to,
      abi = _ref3.abi,
      from = _ref3.from,
      method = _ref3.method,
      params = _ref3.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var _contract$methods, contract, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
              logger("Contract Call: ".concat(contractAddr, ".").concat(method, "(").concat(params ? params.join(', ') : '', ")"));
              _context.prev = 2;
              contract = new web3.eth.Contract(abi, contractAddr);

              if (!(typeof contract.methods[method] !== 'function')) {
                _context.next = 6;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 6:
              _context.next = 8;
              return (_contract$methods = contract.methods)[method].apply(_contract$methods, _toConsumableArray(params || [])).call({
                from: from
              });

            case 8:
              result = _context.sent;
              resolve(result);
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](2);
              reject(_context.t0);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 12]]);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }());
};

module.exports.contractSendTx = function (web3, _ref5) {
  var contractAddr = _ref5.to,
      abi = _ref5.abi,
      from = _ref5.from,
      method = _ref5.method,
      params = _ref5.params,
      value = _ref5.value,
      gas = _ref5.gas,
      useGSN = _ref5.useGSN;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var _contract$methods2, contract, sendTx, estimatedGas;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
              logger("Contract Tx: ".concat(contractAddr, ".").concat(method, "('").concat(params ? params.join(', ') : '', "') by ").concat(from));
              _context2.prev = 2;
              contract = new web3.eth.Contract(abi, contractAddr);

              if (!(typeof contract.methods[method] !== 'function')) {
                _context2.next = 6;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 6:
              sendTx = (_contract$methods2 = contract.methods)[method].apply(_contract$methods2, _toConsumableArray(params || []));
              _context2.t0 = gas;

              if (_context2.t0) {
                _context2.next = 12;
                break;
              }

              _context2.next = 11;
              return calculateEstimatedGas(sendTx, {
                from: from
              });

            case 11:
              _context2.t0 = _context2.sent;

            case 12:
              estimatedGas = _context2.t0;
              sendTx.send({
                from: from,
                value: value,
                useGSN: useGSN || false,
                gas: estimatedGas
              }).on('transactionHash', function (txHash) {
                logger("Tx executed: ", txHash);
              }).on('receipt', function (txReceipt) {
                if (!txReceipt.status) reject(txReceipt);else resolve(txReceipt);
              }).on('error', reject);
              _context2.next = 19;
              break;

            case 16:
              _context2.prev = 16;
              _context2.t1 = _context2["catch"](2);
              reject(_context2.t1);

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 16]]);
    }));

    return function (_x3, _x4) {
      return _ref6.apply(this, arguments);
    };
  }());
};

module.exports.deployContract = function (web3, _ref7) {
  var from = _ref7.from,
      abi = _ref7.abi,
      bytecode = _ref7.bytecode,
      params = _ref7.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref8 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(resolve, reject) {
      var contract, contractDeploy, estimatedGas;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
              _context3.prev = 1;
              contract = new web3.eth.Contract(abi);
              contractDeploy = contract.deploy({
                data: bytecode,
                arguments: params || []
              });
              _context3.next = 6;
              return calculateEstimatedGas(contractDeploy, {
                from: from
              });

            case 6:
              estimatedGas = _context3.sent;
              contractDeploy.send({
                from: from,
                gas: estimatedGas
              }).on('transactionHash', function (txHash) {
                logger("Tx executed: ", txHash);
              }).on('receipt', function (txReceipt) {
                if (!txReceipt.status) reject(FailedTxError(txReceipt));else resolve(txReceipt);
              }).on('error', reject);
              _context3.next = 13;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](1);
              reject(_context3.t0);

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 10]]);
    }));

    return function (_x5, _x6) {
      return _ref8.apply(this, arguments);
    };
  }());
};

module.exports.getBalance = function (web3, _ref9) {
  var address = _ref9.address;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref10 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(resolve, reject) {
      var balance;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
              _context4.prev = 1;
              _context4.next = 4;
              return web3.eth.getBalance(address);

            case 4:
              balance = _context4.sent;
              resolve(balance);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](1);
              reject(_context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 8]]);
    }));

    return function (_x7, _x8) {
      return _ref10.apply(this, arguments);
    };
  }());
};

module.exports.getBlockNumber = function (web3) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref11 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(resolve, reject) {
      var number;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
              _context5.prev = 1;
              _context5.next = 4;
              return web3.eth.getBlockNumber();

            case 4:
              number = _context5.sent;
              resolve(number);
              _context5.next = 11;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](1);
              reject(_context5.t0);

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[1, 8]]);
    }));

    return function (_x9, _x10) {
      return _ref11.apply(this, arguments);
    };
  }());
};

module.exports.networkVersion = function (web3) {
  return new Promise(function (resolve, reject) {
    if (!isLatest(web3)) reject(new Error('Web3 version is not valid'));
    web3.eth.net.getId(function (err, netId) {
      if (err) reject(err);
      resolve(netId);
    });
  });
};

module.exports.getGasPrice = function (web3) {
  return new Promise(function (resolve, reject) {
    web3.eth.getGasPrice().then(function (gasPrice) {
      resolve(gasPrice);
    })["catch"](function (err) {
      resolve(defaultCfg.gasPrice);
    });
  });
};

module.exports.keystore = require('./addon/keystore');
module.exports.utils = require('./addon/utils');
module.exports.validator = require('./addon/validator');
module.exports.v0_20 = require('./addon/v0_20');