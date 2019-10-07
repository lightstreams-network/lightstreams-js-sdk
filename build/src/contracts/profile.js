"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var _require = require('../gsn'),
    fundRecipient = _require.fundRecipient,
    isRelayHubDeployed = _require.isRelayHubDeployed;

var web3Utils = require('web3-utils');

var factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');

var profileScJSON = require('../../build/contracts/GSNProfile.json');

module.exports.initializeProfileFactory =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref) {
    var profileFactoryAddr, relayHub, from, factoryFundingInPht, profileFundingInPht, isRelayHub;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            profileFactoryAddr = _ref.profileFactoryAddr, relayHub = _ref.relayHub, from = _ref.from, factoryFundingInPht = _ref.factoryFundingInPht, profileFundingInPht = _ref.profileFundingInPht;

            if (web3Utils.isAddress(from)) {
              _context.next = 3;
              break;
            }

            throw new Error("Invalid argument \"from\": ".concat(from, ". Expected eth address"));

          case 3:
            if (web3Utils.isAddress(relayHub)) {
              _context.next = 5;
              break;
            }

            throw new Error("Invalid argument \"relayHub\": ".concat(relayHub, ". Expected eth address"));

          case 5:
            if (web3Utils.isAddress(profileFactoryAddr)) {
              _context.next = 7;
              break;
            }

            throw new Error("Invalid argument \"profileFactoryAddr\": ".concat(profileFactoryAddr, ". Expected eth address"));

          case 7:
            if (!isNaN(parseFloat(factoryFundingInPht))) {
              _context.next = 9;
              break;
            }

            throw new Error("Invalid \"factoryFundingInPht\" value ".concat(factoryFundingInPht, ". Expected a float number"));

          case 9:
            if (!isNaN(parseFloat(profileFundingInPht))) {
              _context.next = 11;
              break;
            }

            throw new Error("Invalid \"profileFundingInPht\" value ".concat(profileFundingInPht, ". Expected a float number"));

          case 11:
            _context.next = 13;
            return isRelayHubDeployed(web3, {
              relayHub: relayHub
            });

          case 13:
            isRelayHub = _context.sent;

            if (isRelayHub) {
              _context.next = 16;
              break;
            }

            throw new Error("RelayHub is not found at ".concat(relayHub));

          case 16:
            _context.next = 18;
            return Web3.contractSendTx(web3, profileFactoryAddr, {
              from: from,
              abi: factoryScJSON.abi,
              method: 'initialize',
              params: [relayHub]
            });

          case 18:
            console.log("Activated GSN for ProfileFactory instance for RelayHub ".concat(relayHub, "...")); // Step 3: Top up factory contract

            _context.next = 21;
            return Web3.sendTransaction(web3, {
              from: from,
              to: profileFactoryAddr,
              valueInPht: factoryFundingInPht
            });

          case 21:
            console.log("Topped up ProfileFactory with ".concat(factoryFundingInPht, " PHTs..."));
            _context.next = 24;
            return fundRecipient(web3, {
              from: from,
              recipient: profileFactoryAddr,
              relayHub: relayHub,
              amountInPht: profileFundingInPht
            });

          case 24:
            console.log("Recipient ".concat(profileFactoryAddr, " is sponsored by relayHub with ").concat(profileFundingInPht, " PHTs..."));
            return _context.abrupt("return", profileFactoryAddr);

          case 26:
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

module.exports.deployProfile =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref3) {
    var account, profileFactoryAddr, txReceipt;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            account = _ref3.account, profileFactoryAddr = _ref3.profileFactoryAddr;

            if (!(!account.address || !account.privateKey)) {
              _context2.next = 3;
              break;
            }

            throw new Error("Requires unlocked account's decrypted web3 obj with its address and private key attrs");

          case 3:
            _context2.next = 5;
            return Web3.contractSendTx(web3, profileFactoryAddr, {
              from: account.address,
              abi: factoryScJSON.abi,
              method: 'newProfile',
              params: [RELAY_HUB]
            });

          case 5:
            txReceipt = _context2.sent;
            return _context2.abrupt("return", txReceipt.events['NewProfile'].returnValues['addr']);

          case 7:
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
    var account, ownerAddr, profileAddr;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            account = _ref5.account, ownerAddr = _ref5.ownerAddr, profileAddr = _ref5.profileAddr;

            if (!(!account.address || !account.privateKey)) {
              _context3.next = 3;
              break;
            }

            throw new Error("Requires unlocked account's decrypted web3 obj with its address and private key attrs");

          case 3:
            return _context3.abrupt("return", Web3.contractSendTx(web3, profileAddr, {
              from: account.address,
              abi: factoryScJSON.abi,
              method: 'addOwner',
              params: [ownerAddr]
            }));

          case 4:
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
    var from, newOwner;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref7.from, newOwner = _ref7.newOwner;

            if (!(!newOwner && !from)) {
              _context4.next = 3;
              break;
            }

            throw new Error("Missing mandatory call params");

          case 3:
            return _context4.abrupt("return", Web3.contractSendTx(web3, contractAddr, {
              from: from,
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