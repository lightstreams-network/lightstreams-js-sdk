"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var _require = require('../gsn'),
    fundRecipient = _require.fundRecipient,
    isRelayHubDeployed = _require.isRelayHubDeployed;

var factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');

var profileScJSON = require('../../build/contracts/GSNProfile.json');

module.exports.initializeProfileFactory =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref) {
    var contractAddr, relayHub, from, factoryFundingInPht, profileFundingInPht, isRelayHub, txReceipt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contractAddr = _ref.contractAddr, relayHub = _ref.relayHub, from = _ref.from, factoryFundingInPht = _ref.factoryFundingInPht, profileFundingInPht = _ref.profileFundingInPht;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("relayHub", relayHub);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

            if (!isNaN(parseFloat(factoryFundingInPht))) {
              _context.next = 6;
              break;
            }

            throw new Error("Invalid \"factoryFundingInPht\" value ".concat(factoryFundingInPht, ". Expected a float number"));

          case 6:
            if (!isNaN(parseFloat(profileFundingInPht))) {
              _context.next = 8;
              break;
            }

            throw new Error("Invalid \"profileFundingInPht\" value ".concat(profileFundingInPht, ". Expected a float number"));

          case 8:
            _context.next = 10;
            return isRelayHubDeployed(web3, {
              relayHub: relayHub
            });

          case 10:
            isRelayHub = _context.sent;

            if (isRelayHub) {
              _context.next = 13;
              break;
            }

            throw new Error("RelayHub is not found at ".concat(relayHub));

          case 13:
            _context.next = 15;
            return Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              abi: factoryScJSON.abi,
              method: 'initialize',
              params: [relayHub]
            });

          case 15:
            txReceipt = _context.sent;

            if (txReceipt.status) {
              _context.next = 20;
              break;
            }

            throw new Error("ProfileFactory initialization failed");

          case 20:
            console.log("Activated GSN for ProfileFactory instance for RelayHub ".concat(relayHub, "..."));

          case 21:
            _context.next = 23;
            return Web3Wrapper.sendTransaction(web3, {
              from: from,
              to: contractAddr,
              valueInPht: factoryFundingInPht
            });

          case 23:
            console.log("Topped up ProfileFactory with ".concat(factoryFundingInPht, " PHTs..."));
            _context.next = 26;
            return fundRecipient(web3, {
              from: from,
              recipient: contractAddr,
              relayHub: relayHub,
              amountInPht: profileFundingInPht
            });

          case 26:
            console.log("Recipient ".concat(contractAddr, " is sponsored by relayHub with ").concat(profileFundingInPht, " PHTs..."));
            return _context.abrupt("return", contractAddr);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports.deployProfileByFactory =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref3) {
    var from, contractAddr, useGSN, txReceipt;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref3.from, contractAddr = _ref3.contractAddr, useGSN = _ref3.useGSN;
            _context2.next = 3;
            return Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: useGSN || false,
              abi: factoryScJSON.abi,
              method: 'newProfile',
              params: [from]
            });

          case 3:
            txReceipt = _context2.sent;
            return _context2.abrupt("return", txReceipt.events['NewProfile'].returnValues['addr']);

          case 5:
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

module.exports.addOwner =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref5) {
    var from, contractAddr, useGSN, ownerAddr;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            from = _ref5.from, contractAddr = _ref5.contractAddr, useGSN = _ref5.useGSN, ownerAddr = _ref5.ownerAddr;
            return _context3.abrupt("return", Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: useGSN || false,
              abi: profileScJSON.abi,
              method: 'addOwner',
              params: [ownerAddr]
            }));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

module.exports.recover =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, contractAddr, _ref7) {
    var from, newOwner, useGSN;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref7.from, newOwner = _ref7.newOwner, useGSN = _ref7.useGSN;

            if (!(!newOwner && !from)) {
              _context4.next = 3;
              break;
            }

            throw new Error("Missing mandatory call params");

          case 3:
            return _context4.abrupt("return", Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: useGSN || false,
              method: 'recover',
              abi: profileScJSON.abi,
              params: [newOwner]
            }));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8, _x9) {
    return _ref8.apply(this, arguments);
  };
}();