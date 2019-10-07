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

var web3Utils = require('web3-utils');

module.exports.Web3 = function (_ref) {
  var host = _ref.host,
      dev = _ref.dev,
      privateKey = _ref.privateKey;
  return fromConnection(host, {
    gsn: {
      dev: dev || false,
      signKey: privateKey
    }
  }).then(function (ctx) {
    return ctx.lib;
  });
}; // From account is sending $amountInPht tokens to the relayHub to sponsor the usage
// of the smart contract address specified at the recipient


module.exports.fundRecipient =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var from, recipient, relayHub, amountInPht;
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
            _context.next = 13;
            return fRecipient(web3, {
              from: from,
              recipient: recipient,
              relayHubAddress: relayHub,
              amount: web3.utils.toWei(amountInPht, "ether")
            });

          case 13:
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

module.exports.isRelayHubDeployed =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref4) {
    var relayHub;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            relayHub = _ref4.relayHub;
            _context2.prev = 1;
            _context2.next = 4;
            return getRelayHub(web3, relayHub);

          case 4:
            return _context2.abrupt("return", true);

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