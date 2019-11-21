"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var artistTokenSc = require('../../build/contracts/ArtistToken.json');

var fundingPoolSc = require('../../build/contracts/FundingPool.json');

var wphtSc = require('../../build/contracts/WPHT.json');

module.exports.deployFundingPool =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref) {
    var from, receipt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref.from;
            Web3Wrapper.validator.validateAddress("from", from);
            _context.next = 4;
            return Web3Wrapper.deployContract(web3, {
              from: from,
              useGSN: false,
              abi: fundingPoolSc.abi,
              bytecode: fundingPoolSc.bytecode,
              params: []
            });

          case 4:
            receipt = _context.sent;
            console.log("FundingPool deployed at: ".concat(receipt.contractAddress));
            return _context.abrupt("return", receipt);

          case 7:
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

module.exports.deployArtistToken =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref3) {
    var from, name, symbol, wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr, reserveRatio, gasPrice, theta, p0, initialRaise, friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution, receipt;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref3.from, name = _ref3.name, symbol = _ref3.symbol, wphtAddr = _ref3.wphtAddr, fundingPoolAddr = _ref3.fundingPoolAddr, feeRecipientAddr = _ref3.feeRecipientAddr, pauserAddr = _ref3.pauserAddr, reserveRatio = _ref3.reserveRatio, gasPrice = _ref3.gasPrice, theta = _ref3.theta, p0 = _ref3.p0, initialRaise = _ref3.initialRaise, friction = _ref3.friction, hatchDurationSeconds = _ref3.hatchDurationSeconds, hatchVestingDurationSeconds = _ref3.hatchVestingDurationSeconds, minExternalContribution = _ref3.minExternalContribution;

            if (!(name && !name.length > 1)) {
              _context2.next = 3;
              break;
            }

            throw new Error("Invalid argument \"name\": \"".concat(name, "\". Expected a valid artist name"));

          case 3:
            if (!(symbol && !symbol.length === 3)) {
              _context2.next = 5;
              break;
            }

            throw new Error("Invalid argument \"symbol\": \"".concat(symbol, "\". Expected a 3 char artist symbol"));

          case 5:
            symbol = symbol.toUpperCase();
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateAddress("fundingPoolAddr", fundingPoolAddr);
            Web3Wrapper.validator.validateAddress("feeRecipientAddr", feeRecipientAddr);
            Web3Wrapper.validator.validateAddress("pauserAddr", pauserAddr);

            if (!isNaN(parseInt(reserveRatio))) {
              _context2.next = 12;
              break;
            }

            throw new Error("Invalid \"reserveRatio\" value \"".concat(reserveRatio, "\". Expected an integer number"));

          case 12:
            if (!isNaN(parseInt(gasPrice))) {
              _context2.next = 14;
              break;
            }

            throw new Error("Invalid \"gasPrice\" value \"".concat(gasPrice, "\". Expected an integer number"));

          case 14:
            if (!isNaN(parseInt(theta))) {
              _context2.next = 16;
              break;
            }

            throw new Error("Invalid \"theta\" value \"".concat(theta, "\". Expected an integer number"));

          case 16:
            if (!isNaN(parseInt(p0))) {
              _context2.next = 18;
              break;
            }

            throw new Error("Invalid \"p0\" value \"".concat(p0, "\". Expected an integer number"));

          case 18:
            if (!isNaN(parseInt(initialRaise))) {
              _context2.next = 20;
              break;
            }

            throw new Error("Invalid \"initialRaise\" value \"".concat(initialRaise, "\". Expected an integer number"));

          case 20:
            if (!isNaN(parseInt(friction))) {
              _context2.next = 22;
              break;
            }

            throw new Error("Invalid \"friction\" value \"".concat(friction, "\". Expected an integer number"));

          case 22:
            if (!isNaN(parseInt(hatchDurationSeconds))) {
              _context2.next = 24;
              break;
            }

            throw new Error("Invalid \"hatch duration\" value \"".concat(hatchDurationSeconds, "\". Expected an integer number"));

          case 24:
            if (!isNaN(parseInt(hatchVestingDurationSeconds))) {
              _context2.next = 26;
              break;
            }

            throw new Error("Invalid \"hatch vesting duration\" value \"".concat(hatchVestingDurationSeconds, "\". Expected an integer number"));

          case 26:
            if (!isNaN(parseInt(minExternalContribution))) {
              _context2.next = 28;
              break;
            }

            throw new Error("Invalid \"minExternalContribution\" value \"".concat(minExternalContribution, "\". Expected an integer number"));

          case 28:
            _context2.next = 30;
            return Web3Wrapper.deployContract(web3, {
              from: from,
              useGSN: false,
              abi: artistTokenSc.abi,
              bytecode: artistTokenSc.bytecode,
              params: [name, symbol, [wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr], [gasPrice, theta, p0, initialRaise, friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution], reserveRatio]
            });

          case 30:
            receipt = _context2.sent;
            console.log("ArtistToken deployed at: ".concat(receipt.contractAddress));
            return _context2.abrupt("return", receipt);

          case 33:
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

module.exports.isArtistTokenHatched =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref5) {
    var artistTokenAddr, isHatched;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            artistTokenAddr = _ref5.artistTokenAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context3.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'isHatched',
              abi: artistTokenSc.abi,
              params: []
            });

          case 4:
            isHatched = _context3.sent;
            console.log("ArtistToken ".concat(artistTokenAddr, " is hatched: ").concat(isHatched));
            return _context3.abrupt("return", isHatched);

          case 7:
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

module.exports.hatchArtistToken =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref7) {
    var from, artistTokenAddr, wphtAddr, amountWeiBn;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref7.from, artistTokenAddr = _ref7.artistTokenAddr, wphtAddr = _ref7.wphtAddr, amountWeiBn = _ref7.amountWeiBn;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);
            _context4.next = 7;
            return Web3Wrapper.contractSendTx(web3, {
              to: wphtAddr,
              from: from,
              useGSN: false,
              method: 'approve',
              abi: wphtSc.abi,
              params: [artistTokenAddr, amountWeiBn.toString()]
            });

          case 7:
            _context4.next = 9;
            return Web3Wrapper.contractSendTx(web3, {
              to: artistTokenAddr,
              from: from,
              useGSN: false,
              method: 'hatchContribute',
              gas: 1000000,
              abi: artistTokenSc.abi,
              params: [amountWeiBn.toString()]
            });

          case 9:
            console.log("Hatcher ".concat(from, " sent a hatch worth ").concat(Web3Wrapper.utils.wei2pht(amountWeiBn), " PHT to ArtistToken ").concat(artistTokenAddr));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}();

module.exports.getArtistTokenTotalSupply =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(web3, _ref9) {
    var artistTokenAddr, totalSupply;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            artistTokenAddr = _ref9.artistTokenAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context5.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'totalSupply',
              abi: artistTokenSc.abi,
              params: []
            });

          case 4:
            totalSupply = _context5.sent;
            console.log("ArtistToken ".concat(artistTokenAddr, " total supply is: ").concat(Web3Wrapper.utils.wei2pht(totalSupply), " PHT"));
            return _context5.abrupt("return", totalSupply);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref10.apply(this, arguments);
  };
}();

var getArtistTokenName =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(web3, _ref11) {
    var artistTokenAddr;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            artistTokenAddr = _ref11.artistTokenAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context6.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'name',
              abi: artistTokenSc.abi,
              params: []
            });

          case 4:
            return _context6.abrupt("return", _context6.sent);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getArtistTokenName(_x11, _x12) {
    return _ref12.apply(this, arguments);
  };
}();

module.exports.getArtistTokenSymbol = getArtistTokenName;

var getArtistTokenSymbol =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(web3, _ref13) {
    var artistTokenAddr;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            artistTokenAddr = _ref13.artistTokenAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context7.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'symbol',
              abi: artistTokenSc.abi,
              params: []
            });

          case 4:
            return _context7.abrupt("return", _context7.sent);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getArtistTokenSymbol(_x13, _x14) {
    return _ref14.apply(this, arguments);
  };
}();

module.exports.getArtistTokenSymbol = getArtistTokenSymbol;

module.exports.getArtistTokenBalanceOf =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(web3, _ref15) {
    var artistTokenAddr, accountAddr, symbol, balance;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            artistTokenAddr = _ref15.artistTokenAddr, accountAddr = _ref15.accountAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);
            _context8.next = 5;
            return getArtistTokenSymbol(web3, {
              artistTokenAddr: artistTokenAddr
            });

          case 5:
            symbol = _context8.sent;
            _context8.next = 8;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'balanceOf',
              abi: artistTokenSc.abi,
              params: [accountAddr]
            });

          case 8:
            balance = _context8.sent;
            console.log("Account ".concat(accountAddr, " has ").concat(Web3Wrapper.utils.wei2pht(balance.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr));
            return _context8.abrupt("return", Web3Wrapper.utils.toBN(balance));

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
    return _ref16.apply(this, arguments);
  };
}();

module.exports.buyArtistTokens =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(web3, _ref17) {
    var from, artistTokenAddr, wphtAddr, amountWeiBn, symbol, receipt, tokens;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            from = _ref17.from, artistTokenAddr = _ref17.artistTokenAddr, wphtAddr = _ref17.wphtAddr, amountWeiBn = _ref17.amountWeiBn;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);
            _context9.next = 7;
            return getArtistTokenSymbol(web3, {
              artistTokenAddr: artistTokenAddr
            });

          case 7:
            symbol = _context9.sent;
            _context9.next = 10;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: wphtAddr,
              value: amountWeiBn.toString(),
              useGSN: false,
              method: 'deposit',
              abi: wphtSc.abi,
              params: []
            });

          case 10:
            _context9.next = 12;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: wphtAddr,
              useGSN: false,
              method: 'approve',
              abi: wphtSc.abi,
              params: [artistTokenAddr, amountWeiBn.toString()]
            });

          case 12:
            _context9.next = 14;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: artistTokenAddr,
              useGSN: false,
              method: 'mint',
              gas: 1000000,
              abi: artistTokenSc.abi,
              params: [amountWeiBn.toString()]
            });

          case 14:
            receipt = _context9.sent;
            tokens = receipt.events['CurvedMint'].returnValues['amount'];
            console.log("Buyer ".concat(from, " purchased ").concat(Web3Wrapper.utils.wei2pht(tokens.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr));
            return _context9.abrupt("return", Web3Wrapper.utils.toBN(tokens));

          case 18:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x17, _x18) {
    return _ref18.apply(this, arguments);
  };
}();

module.exports.sellArtistTokens =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(web3, _ref19) {
    var from, artistTokenAddr, amountBn, symbol, receipt, wphtReimbursement;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            from = _ref19.from, artistTokenAddr = _ref19.artistTokenAddr, amountBn = _ref19.amountBn;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateWeiBn("amountBn", amountBn);
            _context10.next = 6;
            return getArtistTokenSymbol(web3, {
              artistTokenAddr: artistTokenAddr
            });

          case 6:
            symbol = _context10.sent;
            _context10.next = 9;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: artistTokenAddr,
              useGSN: false,
              method: 'burn',
              gas: 1000000,
              abi: artistTokenSc.abi,
              params: [amountBn.toString()]
            });

          case 9:
            receipt = _context10.sent;
            wphtReimbursement = receipt.events['CurvedBurn'].returnValues['reimbursement'];
            console.log("Account ".concat(from, " sold ").concat(Web3Wrapper.utils.wei2pht(amountBn.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr, " for ").concat(Web3Wrapper.utils.wei2pht(wphtReimbursement.toString()), " WPHT"));
            return _context10.abrupt("return", wphtReimbursement);

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x19, _x20) {
    return _ref20.apply(this, arguments);
  };
}();