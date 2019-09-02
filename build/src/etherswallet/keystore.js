"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 29/08/19 18:13
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ethers = require('ethers');

var showProgressCb = function showProgressCb(actionText, progress) {
  if (progress % 5 === 0) {
    console.log("".concat(actionText, ": ") + parseInt(progress) + "% complete");
  }
};

module.exports.createRandomWallet =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(password) {
    var wallet;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wallet = ethers.Wallet.createRandom();
            _context.t0 = JSON;
            _context.next = 4;
            return wallet.encrypt(password, function (progress) {
              return showProgressCb('Create random wallet', progress * 100);
            });

          case 4:
            _context.t1 = _context.sent;
            return _context.abrupt("return", _context.t0.parse.call(_context.t0, _context.t1));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.generateRandomSeedPhrase = function () {
  var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(bytes), ethers.wordlists.en);
};

module.exports.createWallet =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(mnemonic, password) {
    var wallet;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            wallet = ethers.Wallet.fromMnemonic(mnemonic);
            _context2.t0 = JSON;
            _context2.next = 4;
            return wallet.encrypt(password, function (progress) {
              return showProgressCb('Encrypt wallet', progress * 100);
            });

          case 4:
            _context2.t1 = _context2.sent;
            return _context2.abrupt("return", _context2.t0.parse.call(_context2.t0, _context2.t1));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports.decryptWallet =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(encryptedWalletJson, password) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWalletJson), password, function (progress) {
              return showProgressCb('Decrypt wallet', progress * 100);
            });

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();