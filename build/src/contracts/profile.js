"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 14/08/19 15:44
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Debug = require('debug');

var Web3Wrapper = require('../web3');

var _require = require('../gsn'),
    fundRecipient = _require.fundRecipient,
    isRelayHubDeployed = _require.isRelayHubDeployed,
    getRecipientFunds = _require.getRecipientFunds;

var factoryScJSON = require('../../build/contracts/GSNProfileFactory.json');

var profileScJSON = require('../../build/contracts/GSNProfile.json');

var logger = Debug('ls-sdk:contract:profile');

var _require2 = require('../leth/cid'),
    convertHexToCid = _require2.convertHexToCid,
    convertCidToBytes32 = _require2.convertCidToBytes32;

module.exports.initializeProfileFactory =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var contractAddr, relayHub, from, factoryFundingInPht, faucetFundingInPht, isRelayHub, txReceipt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contractAddr = _ref2.contractAddr, relayHub = _ref2.relayHub, from = _ref2.from, factoryFundingInPht = _ref2.factoryFundingInPht, faucetFundingInPht = _ref2.faucetFundingInPht;
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
            logger("Activated GSN for ProfileFactory instance for RelayHub ".concat(relayHub, "..."));

          case 21:
            _context.next = 23;
            return fundRecipient(web3, {
              from: from,
              recipient: contractAddr,
              relayHub: relayHub,
              amountInPht: "".concat(factoryFundingInPht)
            });

          case 23:
            logger("Recipient ".concat(contractAddr, " is sponsored by relayHub with ").concat(factoryFundingInPht, " PHTs...")); // Step 4: Top up factory contract to fund new profile deployments

            _context.next = 26;
            return Web3Wrapper.sendTransaction(web3, {
              from: from,
              to: contractAddr,
              valueInPht: "".concat(faucetFundingInPht)
            });

          case 26:
            logger("Topped up ProfileFactory with ".concat(faucetFundingInPht, " PHTs to fund new profile creations..."));
            return _context.abrupt("return", contractAddr);

          case 28:
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

module.exports.validateHasEnoughFundToDeployProfile =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref4) {
    var contractAddr, recipientFundsInWei, recipientFundsInPht, balanceInWei, balanceInPht, newProfileFundingInWei, newProfileFundingInPht;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            contractAddr = _ref4.contractAddr;
            _context2.next = 3;
            return getRecipientFunds(web3, {
              recipient: contractAddr
            });

          case 3:
            recipientFundsInWei = _context2.sent;
            recipientFundsInPht = Web3Wrapper.utils.toPht("".concat(recipientFundsInWei));
            logger("GSNProfileFactory recipient has ".concat(recipientFundsInPht, " PHT for GSN"));

            if (!(parseFloat(recipientFundsInPht) < 1.0)) {
              _context2.next = 8;
              break;
            }

            throw new Error("Not enough recipient funds: ".concat(recipientFundsInPht, " PHT"));

          case 8:
            _context2.next = 10;
            return Web3Wrapper.getBalance(web3, {
              address: contractAddr
            });

          case 10:
            balanceInWei = _context2.sent;
            balanceInPht = Web3Wrapper.utils.toPht(balanceInWei);
            logger("GSNProfileFactory contract has ".concat(balanceInPht, " PHT in balance"));
            _context2.next = 15;
            return Web3Wrapper.contractCall(web3, {
              to: contractAddr,
              abi: factoryScJSON.abi,
              method: 'profileFunding'
            });

          case 15:
            newProfileFundingInWei = _context2.sent;
            newProfileFundingInPht = Web3Wrapper.utils.toPht(newProfileFundingInWei);

            if (!(parseFloat(balanceInPht) < parseFloat(newProfileFundingInPht))) {
              _context2.next = 19;
              break;
            }

            throw new Error("Not enough funds in factory contract. Requires ".concat(newProfileFundingInPht, " PHT, has ").concat(balanceInPht, " PHT"));

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports.deployProfileByFactory =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref6) {
    var from, owner, contractAddr, useGSN, txReceipt;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            from = _ref6.from, owner = _ref6.owner, contractAddr = _ref6.contractAddr, useGSN = _ref6.useGSN;
            _context3.next = 3;
            return Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: useGSN || false,
              abi: factoryScJSON.abi,
              method: 'newProfile',
              params: [owner || from]
            });

          case 3:
            txReceipt = _context3.sent;
            return _context3.abrupt("return", txReceipt.events['NewProfile'].returnValues['addr']);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();

module.exports.deployProfileFactory = function (web3, _ref7) {
  var from = _ref7.from,
      profileFundingInPht = _ref7.profileFundingInPht;
  return Web3Wrapper.deployContract(web3, {
    from: from,
    abi: factoryScJSON.abi,
    bytecode: factoryScJSON.bytecode,
    params: [Web3Wrapper.utils.toWei("".concat(profileFundingInPht))]
  });
};

module.exports.deployProfile = function (web3, _ref8) {
  var from = _ref8.from,
      owner = _ref8.owner;
  return Web3Wrapper.deployContract(web3, {
    from: from,
    abi: profileScJSON.abi,
    bytecode: profileScJSON.bytecode,
    params: [owner]
  });
};

module.exports.addOwner =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref10) {
    var from, contractAddr, useGSN, ownerAddr;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref10.from, contractAddr = _ref10.contractAddr, useGSN = _ref10.useGSN, ownerAddr = _ref10.ownerAddr;
            return _context4.abrupt("return", Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: useGSN || false,
              abi: profileScJSON.abi,
              method: 'addOwner',
              params: [ownerAddr]
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref9.apply(this, arguments);
  };
}();

module.exports.recover =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(web3, contractAddr, _ref12) {
    var from, newOwner, useGSN;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            from = _ref12.from, newOwner = _ref12.newOwner, useGSN = _ref12.useGSN;

            if (!(!newOwner && !from)) {
              _context5.next = 3;
              break;
            }

            throw new Error("Missing mandatory call params");

          case 3:
            return _context5.abrupt("return", Web3Wrapper.contractSendTx(web3, {
              to: contractAddr,
              from: from,
              useGSN: useGSN || false,
              method: 'recover',
              abi: profileScJSON.abi,
              params: [newOwner]
            }));

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10, _x11) {
    return _ref11.apply(this, arguments);
  };
}();

module.exports.getOwners = function (web3, _ref13) {
  var contractAddr = _ref13.contractAddr;
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getOwners'
  }).then(function (owners) {
    return owners.map(function (addr) {
      return addr.toLowerCase();
    });
  });
};

module.exports.getFiles = function (web3, _ref14) {
  var contractAddr = _ref14.contractAddr;
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getFiles'
  }).then(function (files) {
    return files.map(convertHexToCid);
  });
};

module.exports.getFileAcl = function (web3, _ref15) {
  var contractAddr = _ref15.contractAddr,
      cid = _ref15.cid;
  return Web3Wrapper.contractCall(web3, {
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'getFileAcl',
    params: [convertCidToBytes32(cid)]
  });
};

module.exports.addFile = function (web3, _ref16) {
  var from = _ref16.from,
      contractAddr = _ref16.contractAddr,
      cid = _ref16.cid,
      acl = _ref16.acl;

  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'addFile',
    params: [convertCidToBytes32(cid), acl]
  });
};

module.exports.removeFile = function (web3, _ref17) {
  var from = _ref17.from,
      contractAddr = _ref17.contractAddr,
      cid = _ref17.cid;

  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'removeFile',
    params: [convertCidToBytes32(cid)]
  });
};

var transferToken = module.exports.transferToken = function (web3, _ref18) {
  var from = _ref18.from,
      beneficiary = _ref18.beneficiary,
      contractAddr = _ref18.contractAddr,
      amountInPht = _ref18.amountInPht;
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("beneficiary", beneficiary);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'transferToken',
    params: [beneficiary, Web3Wrapper.utils.toWei(amountInPht)]
  });
};

module.exports.transferIERC20Token = function (web3, _ref19) {
  var from = _ref19.from,
      beneficiary = _ref19.beneficiary,
      contractAddr = _ref19.contractAddr,
      tokenAddr = _ref19.tokenAddr,
      amount = _ref19.amount;
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("beneficiary", beneficiary);
  Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
  Web3Wrapper.validator.validateAddress("tokenAddr", tokenAddr);
  Web3Wrapper.validator.validateWeiBn("amount", amount);
  return Web3Wrapper.contractSendTx(web3, {
    from: from,
    to: contractAddr,
    abi: profileScJSON.abi,
    method: 'transferIERC20Token',
    params: [tokenAddr, beneficiary, amount.toString()]
  });
};

module.exports.hatchArtistToken =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(web3, _ref21) {
    var from, contractAddr, artistTokenAddr, amountInPht, useGSN, receipt, tokens;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            from = _ref21.from, contractAddr = _ref21.contractAddr, artistTokenAddr = _ref21.artistTokenAddr, amountInPht = _ref21.amountInPht, useGSN = _ref21.useGSN;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context6.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              abi: profileScJSON.abi,
              method: 'hatchArtistToken',
              useGSN: useGSN,
              params: [artistTokenAddr, Web3Wrapper.utils.toWei(amountInPht), true]
            });

          case 6:
            receipt = _context6.sent;

            if (receipt.events['HatchedArtistTokens']) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt("return", null);

          case 9:
            tokens = receipt.events['HatchedArtistTokens'].returnValues['amount'];
            logger("Hatcher ".concat(from, " obtained an estimated amount of ").concat(Web3Wrapper.utils.toPht(tokens).toString(), " ArtistTokens ").concat(artistTokenAddr));
            return _context6.abrupt("return", Web3Wrapper.utils.toBN(tokens));

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x12, _x13) {
    return _ref20.apply(this, arguments);
  };
}();

module.exports.claimArtistToken =
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(web3, _ref23) {
    var from, contractAddr, artistTokenAddr, useGSN, receipt, tokens;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            from = _ref23.from, contractAddr = _ref23.contractAddr, artistTokenAddr = _ref23.artistTokenAddr, useGSN = _ref23.useGSN;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context7.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              abi: profileScJSON.abi,
              method: 'claimArtistToken',
              useGSN: useGSN,
              params: [artistTokenAddr]
            });

          case 6:
            receipt = _context7.sent;

            if (receipt.events['ClaimedArtistTokens']) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", null);

          case 9:
            tokens = receipt.events['ClaimedArtistTokens'].returnValues['amount'];
            logger("Hatcher ".concat(from, " claimed an amount of ").concat(Web3Wrapper.utils.toPht(tokens).toString(), " ArtistTokens ").concat(artistTokenAddr));
            return _context7.abrupt("return", Web3Wrapper.utils.toBN(tokens));

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x14, _x15) {
    return _ref22.apply(this, arguments);
  };
}();

module.exports.refundArtistToken =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(web3, _ref25) {
    var from, contractAddr, artistTokenAddr, useGSN, receipt, tokens;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            from = _ref25.from, contractAddr = _ref25.contractAddr, artistTokenAddr = _ref25.artistTokenAddr, useGSN = _ref25.useGSN;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context8.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              abi: profileScJSON.abi,
              method: 'refundArtistToken',
              useGSN: useGSN,
              params: [artistTokenAddr]
            });

          case 6:
            receipt = _context8.sent;

            if (receipt.events['RefundedTokens']) {
              _context8.next = 9;
              break;
            }

            return _context8.abrupt("return", null);

          case 9:
            tokens = receipt.events['RefundedTokens'].returnValues['amount'];
            logger("Hatcher ".concat(from, " get a refund of ").concat(Web3Wrapper.utils.toPht(tokens).toString(), " WPHT tokens"));
            return _context8.abrupt("return", Web3Wrapper.utils.toBN(tokens));

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x16, _x17) {
    return _ref24.apply(this, arguments);
  };
}();

module.exports.buyArtistToken =
/*#__PURE__*/
function () {
  var _ref26 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(web3, _ref27) {
    var from, contractAddr, artistTokenAddr, amountInPht, receipt, tokens;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            from = _ref27.from, contractAddr = _ref27.contractAddr, artistTokenAddr = _ref27.artistTokenAddr, amountInPht = _ref27.amountInPht;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context9.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              abi: profileScJSON.abi,
              method: 'buyArtistToken',
              params: [artistTokenAddr, Web3Wrapper.utils.toWei(amountInPht), true]
            });

          case 6:
            receipt = _context9.sent;

            if (receipt.events['BoughtArtistTokens']) {
              _context9.next = 9;
              break;
            }

            return _context9.abrupt("return", null);

          case 9:
            tokens = receipt.events['BoughtArtistTokens'].returnValues['amount'];
            logger("Buyer ".concat(from, " purchased ").concat(Web3Wrapper.utils.toPht(tokens).toString(), " of ArtistTokens ").concat(artistTokenAddr));
            return _context9.abrupt("return", Web3Wrapper.utils.toBN(tokens));

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x18, _x19) {
    return _ref26.apply(this, arguments);
  };
}();