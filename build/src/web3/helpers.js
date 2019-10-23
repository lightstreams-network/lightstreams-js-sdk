"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * User: ggarrido
 * Date: 16/10/19 9:10
 * Copyright 2019 (c) Lightstreams, Granada
 */
module.exports.isLatest = function (web3) {
  return typeof web3.version === 'string' && web3.version.indexOf('1.') === 0;
};

module.exports.isV0_20 = function (web3) {
  return _typeof(web3.version) === 'object' && web3.version.api.indexOf('0.20') === 0;
};

module.exports.FailedTxError = function (txReceipt) {
  var err = new Error("Tx ".concat(txReceipt.hash, " has been reverted"));
  err.receipt = txReceipt;
  return err;
};

var waitFor = module.exports.waitFor = function (waitInSeconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

var fetchTxReceipt = module.exports.fetchTxReceipt =
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

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.calculateEstimatedGas = function (method, params) {
  return new Promise(function (resolve, reject) {
    method.estimateGas(params, function (err, estimatedGas) {
      if (err) {
        //   resolve(9000000);
        reject(err);
      } else {
        // @TODO Investigate issue with wrong gas estimation
        // As temporal HACK, increasing by % the estimated gas to mitigate wrong estimations
        // and define a minimum gas
        var gasOverflow = parseInt(estimatedGas * 1.2); // 20% Increment

        var gasMin = 100000;
        var gas = gasMin > gasOverflow ? gasMin : gasOverflow;
        resolve(gas);
      }
    });
  });
};