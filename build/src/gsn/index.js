"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 4/10/19 13:37
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Debug = require('debug');

var _require = require('@openzeppelin/network'),
    fromConnection = _require.fromConnection;

var _require2 = require('@openzeppelin/gsn-helpers/src/helpers'),
    fRecipient = _require2.fundRecipient,
    getRelayHub = _require2.getRelayHub;

var _require$utils = require('@openzeppelin/gsn-provider').utils,
    isRelayHubDeployedForRecipient = _require$utils.isRelayHubDeployedForRecipient,
    getRecipientFunds = _require$utils.getRecipientFunds;

var web3Utils = require('web3-utils');

var Web3Wrapper = require('../web3');

var logger = Debug('ls-sdk:gsn');

module.exports.newWeb3Engine = function (provider, _ref) {
  var signKey = _ref.signKey,
      dev = _ref.dev,
      verbose = _ref.verbose;
  return fromConnection(provider, {
    gsn: {
      useGSN: true,
      dev: dev || false,
      verbose: verbose || false,
      signKey: signKey
    }
  }).then(function (ctx) {
    return ctx.lib;
  });
};

module.exports.initializeRecipient =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref3) {
    var from, recipient, relayHub, abi;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref3.from, recipient = _ref3.recipient, relayHub = _ref3.relayHub, abi = _ref3.abi;

            if (Web3Wrapper.utils.isAddress(from)) {
              _context.next = 3;
              break;
            }

            throw new Error("Invalid \"from\" address ".concat(from, ". Expected a valid eth addr"));

          case 3:
            if (Web3Wrapper.utils.isAddress(recipient)) {
              _context.next = 5;
              break;
            }

            throw new Error("Invalid \"recipient\" address ".concat(recipient, ". Expected a valid eth addr"));

          case 5:
            if (Web3Wrapper.utils.isAddress(relayHub)) {
              _context.next = 7;
              break;
            }

            throw new Error("Invalid \"relayHub\" address ".concat(relayHub, ". Expected a valid eth addr"));

          case 7:
            _context.next = 9;
            return getRelayHub(web3, relayHub);

          case 9:
            return _context.abrupt("return", Web3Wrapper.contractSendTx(web3, {
              to: recipient,
              from: from,
              abi: abi,
              method: 'initialize',
              params: [relayHub]
            }));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}(); // The "from" account is sending "amountInPht" tokens to the "relayHub" address to sponsor the usage
// of the smart contract address specified at the "recipient"


module.exports.fundRecipient =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref5) {
    var from, recipient, relayHub, amountInPht, curBalance;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref5.from, recipient = _ref5.recipient, relayHub = _ref5.relayHub, amountInPht = _ref5.amountInPht;

            if (Web3Wrapper.utils.isAddress(from)) {
              _context2.next = 3;
              break;
            }

            throw new Error("Invalid \"from\" address ".concat(from, ". Expected a valid eth addr"));

          case 3:
            if (Web3Wrapper.utils.isAddress(recipient)) {
              _context2.next = 5;
              break;
            }

            throw new Error("Invalid \"recipient\" address ".concat(recipient, ". Expected a valid eth addr"));

          case 5:
            if (Web3Wrapper.utils.isAddress(relayHub)) {
              _context2.next = 7;
              break;
            }

            throw new Error("Invalid \"relayHub\" address ".concat(relayHub, ". Expected a valid eth addr"));

          case 7:
            _context2.next = 9;
            return getRelayHub(web3, relayHub);

          case 9:
            if (!isNaN(parseFloat(amountInPht))) {
              _context2.next = 11;
              break;
            }

            throw new Error("Invalid \"amountInPht\" value ".concat(amountInPht, ". Expected a float number"));

          case 11:
            logger("Account ".concat(from, " depositing ").concat(amountInPht, " PHT in relayhub ").concat(relayHub, " to fund recipient ").concat(recipient, " "));
            _context2.next = 14;
            return fRecipient(web3, {
              from: from,
              recipient: recipient,
              relayHubAddress: relayHub,
              // IMPORTANT: Amount cannot be higher than relay server address balance (@TODO: Implement validation)
              amount: web3Utils.toWei(amountInPht, "ether")
            });

          case 14:
            curBalance = _context2.sent;
            return _context2.abrupt("return", curBalance);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

module.exports.getRecipientFunds =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref7) {
    var recipient;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            recipient = _ref7.recipient;
            _context3.prev = 1;
            _context3.next = 4;
            return getRecipientFunds(web3, recipient);

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);
            return _context3.abrupt("return", false);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 7]]);
  }));

  return function (_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

module.exports.isRelayHubDeployedForRecipient =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref9) {
    var recipient;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            recipient = _ref9.recipient;
            _context4.prev = 1;
            _context4.next = 4;
            return isRelayHubDeployedForRecipient(web3, recipient);

          case 4:
            return _context4.abrupt("return", _context4.sent);

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](1);
            console.error(_context4.t0);
            return _context4.abrupt("return", false);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 7]]);
  }));

  return function (_x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}();

module.exports.isRelayHubDeployed =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(web3, _ref11) {
    var relayHub;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            relayHub = _ref11.relayHub;
            _context5.prev = 1;
            _context5.next = 4;
            return getRelayHub(web3, relayHub);

          case 4:
            return _context5.abrupt("return", true);

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](1);
            console.error(_context5.t0);
            return _context5.abrupt("return", false);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 7]]);
  }));

  return function (_x9, _x10) {
    return _ref10.apply(this, arguments);
  };
}();