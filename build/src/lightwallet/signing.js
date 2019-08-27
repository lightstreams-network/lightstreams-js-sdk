"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 6/08/19 12:01
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Util = require('ethereumjs-util');

var _require = require('eth-lightwallet'),
    signing = _require.signing,
    txutils = _require.txutils;

var encodeConstructorParams = function encodeConstructorParams(web3, abi, params) {
  return abi.filter(function (json) {
    return json.type === 'constructor' && json.inputs.length === params.length;
  }).map(function (json) {
    return json.inputs.map(function (input) {
      return input.type;
    });
  }).map(function (types) {
    return web3.eth.abi.encodeParameters(types, params).slice(2); // Remove initial 0x
  })[0] || '';
};

module.exports = {
  signDeployContractTx: function () {
    var _signDeployContractTx = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(web3, keystore, pwDerivedKey, _ref) {
      var from, bytecode, abi, params, encodeParams, gasLimit, gasPrice, nonce, sendingAddr, contractData, signedTx;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              from = _ref.from, bytecode = _ref.bytecode, abi = _ref.abi, params = _ref.params;
              encodeParams = encodeConstructorParams(web3, abi, params || []);
              _context.next = 4;
              return web3.eth.estimateGas({
                data: bytecode + encodeParams,
                from: from
              });

            case 4:
              gasLimit = _context.sent;
              _context.next = 7;
              return web3.eth.getGasPrice();

            case 7:
              gasPrice = _context.sent;
              _context.next = 10;
              return web3.eth.getTransactionCount(from);

            case 10:
              nonce = _context.sent;
              txOptions = {
                gasPrice: parseInt(gasPrice),
                gasLimit: parseInt(gasLimit),
                value: 0,
                nonce: parseInt(nonce),
                data: bytecode + encodeParams
              };
              sendingAddr = Util.stripHexPrefix(from);
              contractData = txutils.createContractTx(sendingAddr, txOptions);
              signedTx = signing.signTx(keystore, pwDerivedKey, contractData.tx, sendingAddr);
              return _context.abrupt("return", Util.addHexPrefix(signedTx));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function signDeployContractTx(_x, _x2, _x3, _x4) {
      return _signDeployContractTx.apply(this, arguments);
    }

    return signDeployContractTx;
  }(),
  signContractMethodTx: function () {
    var _signContractMethodTx = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(web3, keystore, pwDerivedKey, _ref2) {
      var _contractInstance$met;

      var from, value, method, params, abi, address, gasPrice, nonce, sendingAddr, contractInstance, gasLimit, setValueTx, signedTx;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              from = _ref2.from, value = _ref2.value, method = _ref2.method, params = _ref2.params, abi = _ref2.abi, address = _ref2.address;
              _context2.next = 3;
              return web3.eth.getGasPrice();

            case 3:
              gasPrice = _context2.sent;
              _context2.next = 6;
              return web3.eth.getTransactionCount(from);

            case 6:
              nonce = _context2.sent;
              sendingAddr = Util.stripHexPrefix(from);
              contractInstance = new web3.eth.Contract(abi, address);
              _context2.next = 11;
              return (_contractInstance$met = contractInstance.methods)[method].apply(_contractInstance$met, _toConsumableArray(params)).estimateGas();

            case 11:
              gasLimit = _context2.sent;
              // @TODO: Sanity checks over ABI against params+method
              txOptions = {
                gasPrice: parseInt(gasPrice),
                gasLimit: parseInt(gasLimit),
                value: parseInt(value || 0),
                nonce: parseInt(nonce),
                to: address
              };
              setValueTx = txutils.functionTx(abi, method, params, txOptions);
              signedTx = signing.signTx(keystore, pwDerivedKey, setValueTx, sendingAddr);
              return _context2.abrupt("return", Util.addHexPrefix(signedTx));

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function signContractMethodTx(_x5, _x6, _x7, _x8) {
      return _signContractMethodTx.apply(this, arguments);
    }

    return signContractMethodTx;
  }(),
  signSendValueTx: function () {
    var _signSendValueTx = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(web3, keystore, pwDerivedKey, _ref3) {
      var from, to, value, gasPrice, nonce, signingAddress, txOptions, rawTx, signedTx;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              from = _ref3.from, to = _ref3.to, value = _ref3.value;
              _context3.next = 3;
              return web3.eth.getGasPrice();

            case 3:
              gasPrice = _context3.sent;
              _context3.next = 6;
              return web3.eth.getTransactionCount(from);

            case 6:
              nonce = _context3.sent;
              signingAddress = Util.stripHexPrefix(from);
              txOptions = {
                gasPrice: parseInt(gasPrice),
                gasLimit: 21000,
                value: parseInt(value),
                nonce: parseInt(nonce),
                to: Util.stripHexPrefix(to)
              };
              rawTx = txutils.valueTx(txOptions);
              signedTx = signing.signTx(keystore, pwDerivedKey, rawTx, signingAddress);
              return _context3.abrupt("return", Util.addHexPrefix(signedTx));

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function signSendValueTx(_x9, _x10, _x11, _x12) {
      return _signSendValueTx.apply(this, arguments);
    }

    return signSendValueTx;
  }()
};