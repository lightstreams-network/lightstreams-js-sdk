"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var CID = require('cids');

var _require = require('../gsn'),
    fundRecipient = _require.fundRecipient,
    isRelayHubDeployed = _require.isRelayHubDeployed;

var factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');

var profileScJSON = require('../../build/contracts/GSNProfile.json');

var cidPrefix = 'Qm';
var cidLength = 46;

module.exports.initializeProfileFactory = function _callee(web3, _ref) {
  var contractAddr, relayHub, from, factoryFundingInPht, faucetFundingInPht, isRelayHub, txReceipt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          contractAddr = _ref.contractAddr, relayHub = _ref.relayHub, from = _ref.from, factoryFundingInPht = _ref.factoryFundingInPht, faucetFundingInPht = _ref.faucetFundingInPht;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("relayHub", relayHub);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);

          if (!isNaN(parseFloat(factoryFundingInPht))) {
            _context.next = 6;
            break;
          }

          throw new Error("Invalid \"factoryFundingInPht\" value ".concat(factoryFundingInPht, ". Expected a float number"));

        case 6:
          if (!isNaN(parseFloat(faucetFundingInPht))) {
            _context.next = 8;
            break;
          }

          throw new Error("Invalid \"profileFundingInPht\" value ".concat(faucetFundingInPht, ". Expected a float number"));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(isRelayHubDeployed(web3, {
            relayHub: relayHub
          }));

        case 10:
          isRelayHub = _context.sent;

          if (isRelayHub) {
            _context.next = 13;
            break;
          }

          throw new Error("RelayHub is not found at ".concat(relayHub));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            to: contractAddr,
            from: from,
            abi: factoryScJSON.abi,
            method: 'initialize',
            params: [relayHub]
          }));

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
          return regeneratorRuntime.awrap(fundRecipient(web3, {
            from: from,
            recipient: contractAddr,
            relayHub: relayHub,
            amountInPht: factoryFundingInPht
          }));

        case 23:
          console.log("Recipient ".concat(contractAddr, " is sponsored by relayHub with ").concat(factoryFundingInPht, " PHTs...")); // Step 4: Top up factory contract to fund new profile deployments

          _context.next = 26;
          return regeneratorRuntime.awrap(Web3Wrapper.sendTransaction(web3, {
            from: from,
            to: contractAddr,
            valueInPht: faucetFundingInPht
          }));

        case 26:
          console.log("Topped up ProfileFactory with ".concat(faucetFundingInPht, " PHTs to fund new profile creations..."));
          return _context.abrupt("return", contractAddr);

        case 28:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.deployProfileByFactory = function _callee2(web3, _ref2) {
  var from, contractAddr, useGSN, txReceipt;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          from = _ref2.from, contractAddr = _ref2.contractAddr, useGSN = _ref2.useGSN;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            to: contractAddr,
            from: from,
            useGSN: useGSN || false,
            abi: factoryScJSON.abi,
            method: 'newProfile',
            params: [from]
          }));

        case 3:
          txReceipt = _context2.sent;
          return _context2.abrupt("return", txReceipt.events['NewProfile'].returnValues['addr']);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.addOwner = function _callee3(web3, _ref3) {
  var from, contractAddr, useGSN, ownerAddr;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          from = _ref3.from, contractAddr = _ref3.contractAddr, useGSN = _ref3.useGSN, ownerAddr = _ref3.ownerAddr;
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
  });
};

module.exports.recover = function _callee4(web3, contractAddr, _ref4) {
  var from, newOwner, useGSN;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          from = _ref4.from, newOwner = _ref4.newOwner, useGSN = _ref4.useGSN;

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
  });
};

module.exports.getFiles = function (web3, _ref5) {
  var contractAddr = _ref5.contractAddr;
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getFiles'
  }).then(function (files) {
    return files.map(function (f) {
      // [18,32] Correspond to the removed cidPrefix 'Qm'
      var arrayBuffer = [18, 32].concat(_toConsumableArray(Web3Wrapper.utils.hexToBytes(f)));
      var cidObj = new CID(Web3Wrapper.utils.toBuffer(arrayBuffer));
      return cidObj.toString();
    });
  });
};

module.exports.getFileAcl = function (web3, _ref6) {
  var contractAddr = _ref6.contractAddr,
      cid = _ref6.cid;

  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  var cidObj = new CID(cid);
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getFileAcl',
    params: [cidObj.multihash.slice(2)]
  });
};

module.exports.addFile = function (web3, _ref7) {
  var from = _ref7.from,
      contractAddr = _ref7.contractAddr,
      cid = _ref7.cid,
      acl = _ref7.acl;

  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  var cidObj = new CID(cid);
  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'addFile',
    params: [cidObj.multihash.slice(2), acl]
  });
};