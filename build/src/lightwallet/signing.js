"use strict";

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

module.exports = {
  signSendValueTx: function () {
    var _signSendValueTx = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(web3, keystore, _ref) {
      var from, password, to, value, gasPrice, nonce, txOptions;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              from = _ref.from, password = _ref.password, to = _ref.to, value = _ref.value;
              _context.next = 3;
              return web3.eth.getGasPrice();

            case 3:
              gasPrice = _context.sent;
              _context.next = 6;
              return web3.eth.getTransactionCount(from);

            case 6:
              nonce = _context.sent;
              txOptions = {
                gasPrice: parseInt(gasPrice),
                gasLimit: 21000,
                value: parseInt(value),
                nonce: parseInt(nonce),
                to: Util.stripHexPrefix(to)
              };
              _context.next = 10;
              return new Promise(function (resolve, reject) {
                var rawTx = txutils.valueTx(txOptions);
                var signingAddress = Util.stripHexPrefix(from);
                keystore.keyFromPassword(password, function (err, pwDerivedKey) {
                  if (err) {
                    reject(err);
                  }

                  var signedTx = signing.signTx(keystore, pwDerivedKey, rawTx, signingAddress);
                  var rawSignedTx = Util.addHexPrefix(signedTx);
                  resolve(rawSignedTx);
                });
              });

            case 10:
              return _context.abrupt("return", _context.sent);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function signSendValueTx(_x, _x2, _x3) {
      return _signSendValueTx.apply(this, arguments);
    }

    return signSendValueTx;
  }()
};