"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 4/10/19 13:37
 * Copyright 2019 (c) Lightstreams, Granada
 */
var _require = require('@openzeppelin/network'),
    fromConnection = _require.fromConnection;

var _require2 = require('@openzeppelin/gsn-helpers/src/helpers'),
    fRecipient = _require2.fundRecipient,
    getRelayHub = _require2.getRelayHub;

var _require$utils = require('@openzeppelin/gsn-provider').utils,
    isRelayHubDeployedForRecipient = _require$utils.isRelayHubDeployedForRecipient,
    getRecipientFunds = _require$utils.getRecipientFunds;

var web3Utils = require('web3-utils');

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
}; // The "from" account is sending "amountInPht" tokens to the "relayHub" address to sponsor the usage
// of the smart contract address specified at the "recipient"


module.exports.fundRecipient =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var from, recipient, relayHub, amountInPht, curBalance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref2.from, recipient = _ref2.recipient, relayHub = _ref2.relayHub, amountInPht = _ref2.amountInPht;

            if (web3Utils.isAddress(from)) {
              _context.next = 3;
              break;
            }

            throw new Error("Invalid \"from\" address ".concat(from, ". Expected a valid eth addr"));

          case 3:
            if (web3Utils.isAddress(recipient)) {
              _context.next = 5;
              break;
            }

            throw new Error("Invalid \"recipient\" address ".concat(recipient, ". Expected a valid eth addr"));

          case 5:
            if (web3Utils.isAddress(relayHub)) {
              _context.next = 7;
              break;
            }

            throw new Error("Invalid \"relayHub\" address ".concat(relayHub, ". Expected a valid eth addr"));

          case 7:
            _context.next = 9;
            return getRelayHub(web3, relayHub);

          case 9:
            if (!isNaN(parseFloat(amountInPht))) {
              _context.next = 11;
              break;
            }

            throw new Error("Invalid \"amountInPht\" value ".concat(amountInPht, ". Expected a float number"));

          case 11:
            console.log("Account ".concat(from, " depositing ").concat(amountInPht, " PHT in relayhub ").concat(relayHub, " to fund recipient ").concat(recipient, " "));
            _context.next = 14;
            return fRecipient(web3, {
              from: from,
              recipient: recipient,
              relayHubAddress: relayHub,
              // IMPORTANT: Amount cannot be higher than relay server address balance (@TODO: Implement validation)
              amount: web3Utils.toWei(amountInPht, "ether")
            });

          case 14:
            curBalance = _context.sent;
            return _context.abrupt("return", curBalance);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports.getRecipientFunds =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref4) {
    var recipient;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            recipient = _ref4.recipient;
            _context2.prev = 1;
            _context2.next = 4;
            return getRecipientFunds(web3, recipient);

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](1);
            console.error(_context2.t0);
            return _context2.abrupt("return", false);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();

module.exports.isRelayHubDeployedForRecipient =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref6) {
    var recipient;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            recipient = _ref6.recipient;
            _context3.prev = 1;
            _context3.next = 4;
            return isRelayHubDeployedForRecipient(web3, recipient);

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
    return _ref7.apply(this, arguments);
  };
}();

module.exports.isRelayHubDeployed =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref8) {
    var relayHub;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            relayHub = _ref8.relayHub;
            _context4.prev = 1;
            _context4.next = 4;
            return getRelayHub(web3, relayHub);

          case 4:
            return _context4.abrupt("return", true);

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
    return _ref9.apply(this, arguments);
  };
}();