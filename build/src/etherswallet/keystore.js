"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 29/08/19 18:13
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Debug = require('debug');

var ethers = require('ethers');

var logger = Debug('ls-sdk:etherswallet');

var showProgressCb = function showProgressCb(actionText, progress) {
  if (progress % 5 === 0) {
    logger("".concat(actionText, ": ") + parseInt(progress) + "% complete");
  }
};

module.exports.createRandomWallet = function () {
  return ethers.Wallet.createRandom();
};

module.exports.generateRandomSeedPhrase = function () {
  var bytes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(bytes), ethers.wordlists.en);
};

module.exports.createWallet = function (mnemonic) {
  return ethers.Wallet.fromMnemonic(mnemonic);
};

module.exports.encryptWallet =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(wallet, password) {
    var options;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = {
              scrypt: {
                N: 1 << 8,
                //N: (1 << 16),
                r: 8,
                p: 1
              }
            };
            _context.t0 = JSON;
            _context.next = 4;
            return wallet.encrypt(password, options, function (progress) {
              return showProgressCb('Encrypt wallet', progress * 100);
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

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.decryptWallet = function (encryptedWalletJson, password) {
  return new Promise(function (resolve, reject) {
    ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWalletJson), password, function (progress) {
      return showProgressCb('Decrypt wallet', progress * 100);
    }).then(resolve)["catch"](reject);
  });
};