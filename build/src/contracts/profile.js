"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('../web3');

var _require = require('../web3-provider'),
    web3GSNProvider = _require.web3GSNProvider;

var factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');

var profileScJSON = require('../../build/contracts/GSNProfile.json');

var _require2 = require('@openzeppelin/gsn-helpers'),
    fundRecipient = _require2.fundRecipient;

module.exports.deployGSNFactory =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref) {
    var relayHub, from, factoryFundingInPht, profileFundingInPht, txHash, txReceipt, profileFactoryAddr;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            relayHub = _ref.relayHub, from = _ref.from, factoryFundingInPht = _ref.factoryFundingInPht, profileFundingInPht = _ref.profileFundingInPht;
            _context.next = 3;
            return Web3.deployContract(web3, {
              from: from,
              abi: factoryScJSON.abi,
              bytecode: factoryScJSON.bytecode
            });

          case 3:
            txHash = _context.sent;
            _context.next = 6;
            return Web3.getTxReceipt(web3, {
              txHash: txHash
            });

          case 6:
            txReceipt = _context.sent;

            if (txReceipt.status) {
              _context.next = 10;
              break;
            }

            console.error(txReceipt);
            throw new Error("Tx failed ".concat(txHash));

          case 10:
            profileFactoryAddr = txReceipt.contractAddress;
            console.log("GSNProfileFactory.sol successfully deployed at ".concat(profileFactoryAddr, "!")); // Step 2: Initialize gsn feature within profile factory contract

            _context.next = 14;
            return Web3.contractSendTx(web3, profileFactoryAddr, {
              from: from,
              abi: factoryScJSON.abi,
              method: 'initialize',
              params: [relayHub]
            });

          case 14:
            txHash = _context.sent;
            _context.next = 17;
            return Web3.getTxReceipt(web3, {
              txHash: txHash
            });

          case 17:
            txReceipt = _context.sent;

            if (txReceipt.status) {
              _context.next = 21;
              break;
            }

            console.error(txReceipt);
            throw new Error("Tx failed ".concat(txHash));

          case 21:
            console.log("Activated GSN for ProfileFactory instance for RelayHub ".concat(relayHub, "...")); // Step 3: Top up factory contract

            _context.next = 24;
            return Web3.sendTransaction(web3, {
              from: from,
              to: profileFactoryAddr,
              valueInPht: factoryFundingInPht
            });

          case 24:
            txHash = _context.sent;
            _context.next = 27;
            return Web3.getTxReceipt(web3, {
              txHash: txHash
            });

          case 27:
            txReceipt = _context.sent;

            if (txReceipt.status) {
              _context.next = 31;
              break;
            }

            console.error(txReceipt);
            throw new Error("Tx failed ".concat(txHash));

          case 31:
            console.log("Topped up ProfileFactory with ".concat(factoryFundingInPht, " PHTs..."));
            _context.next = 34;
            return fundRecipient(web3, {
              recipient: profileFactoryAddr,
              relayHubAddress: relayHub,
              amount: web3.utils.toWei(profileFundingInPht, "ether")
            });

          case 34:
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

module.exports.deployWithGSN =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref3) {
    var account, profileFactoryAddr, gsnWeb3, txHash, txReceipt;
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
            return web3GSNProvider({
              host: web3.currentProvider.host,
              privateKey: account.privateKey
            });

          case 5:
            gsnWeb3 = _context2.sent;
            txHash = Web3.contractSendTx(gsnWeb3, profileFactoryAddr, {
              from: account.address,
              abi: factoryScJSON.abi,
              method: 'newProfile',
              params: [RELAY_HUB]
            });
            _context2.next = 9;
            return Web3.getTxReceipt(web3, {
              txHash: txHash
            });

          case 9:
            txReceipt = _context2.sent;

            if (txReceipt.status) {
              _context2.next = 12;
              break;
            }

            throw new Error("Failed to create a new profile. TX: ".concat(txHash));

          case 12:
            return _context2.abrupt("return", txReceipt.events['NewProfile'].returnValues['addr']);

          case 13:
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

module.exports.addOwnerWithGSN =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref5) {
    var account, ownerAddr, profileAddr, gsnWeb3, txHash, txReceipt;
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
            _context3.next = 5;
            return web3GSNProvider({
              host: web3.currentProvider.host,
              privateKey: account.privateKey
            });

          case 5:
            gsnWeb3 = _context3.sent;
            txHash = Web3.contractSendTx(gsnWeb3, profileAddr, {
              from: account.address,
              abi: factoryScJSON.abi,
              method: 'addOwner',
              params: [ownerAddr]
            });
            _context3.next = 9;
            return Web3.getTxReceipt(web3, {
              txHash: txHash
            });

          case 9:
            txReceipt = _context3.sent;

            if (txReceipt.status) {
              _context3.next = 12;
              break;
            }

            throw new Error("Failed to add a new profile owner. TX: ".concat(txReceipt.transactionHash));

          case 12:
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

module.exports.recover = function (web3, contractAddr, _ref7) {
  var from = _ref7.from,
      newOwner = _ref7.newOwner;

  if (!newOwner && !from) {
    throw new Error("Missing mandatory call params");
  }

  return Web3.contractSendTx(web3, contractAddr, {
    from: from,
    method: 'recover',
    abi: profileScJSON.abi,
    params: [newOwner]
  }).then(function (txHash) {
    return Web3.getTxReceipt(web3, {
      txHash: txHash
    });
  });
};