"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var Debug = require('debug');

var artistTokenSc = require('../../build/contracts/ArtistToken.json');

var fundingPoolSc = require('../../build/contracts/FundingPool.json');

var wphtSc = require('../../build/contracts/WPHT.json');

var logger = Debug('ls-sdk:contract:artistToken');

module.exports.deployFundingPool =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var from, receipt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref2.from;
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
            logger("FundingPool deployed at: ".concat(receipt.contractAddress));
            return _context.abrupt("return", receipt);

          case 7:
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

module.exports.deployArtistToken =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref4) {
    var from, name, symbol, owner, wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr, reserveRatio, gasPrice, theta, p0, initialRaise, friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution, receipt;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref4.from, name = _ref4.name, symbol = _ref4.symbol, owner = _ref4.owner, wphtAddr = _ref4.wphtAddr, fundingPoolAddr = _ref4.fundingPoolAddr, feeRecipientAddr = _ref4.feeRecipientAddr, pauserAddr = _ref4.pauserAddr, reserveRatio = _ref4.reserveRatio, gasPrice = _ref4.gasPrice, theta = _ref4.theta, p0 = _ref4.p0, initialRaise = _ref4.initialRaise, friction = _ref4.friction, hatchDurationSeconds = _ref4.hatchDurationSeconds, hatchVestingDurationSeconds = _ref4.hatchVestingDurationSeconds, minExternalContribution = _ref4.minExternalContribution;

            if (!(name && !name.length > 1)) {
              _context2.next = 3;
              break;
            }

            throw new Error("Invalid argument \"name\": \"".concat(name, "\". Expected a valid artist name"));

          case 3:
            if (!(symbol && !(symbol.length === 3 || symbol.length === 4))) {
              _context2.next = 5;
              break;
            }

            throw new Error("Invalid argument \"symbol\": \"".concat(symbol, "\". Expected a 3-4 char artist symbol"));

          case 5:
            symbol = symbol.toUpperCase();

            if (owner) {
              Web3Wrapper.validator.validateAddress("owner", owner);
            }

            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateAddress("fundingPoolAddr", fundingPoolAddr);
            Web3Wrapper.validator.validateAddress("feeRecipientAddr", feeRecipientAddr);
            Web3Wrapper.validator.validateAddress("pauserAddr", pauserAddr);

            if (!isNaN(parseInt(reserveRatio))) {
              _context2.next = 13;
              break;
            }

            throw new Error("Invalid \"reserveRatio\" value \"".concat(reserveRatio, "\". Expected an integer number"));

          case 13:
            if (!isNaN(parseInt(gasPrice))) {
              _context2.next = 15;
              break;
            }

            throw new Error("Invalid \"gasPrice\" value \"".concat(gasPrice, "\". Expected an integer number"));

          case 15:
            if (!isNaN(parseInt(theta))) {
              _context2.next = 17;
              break;
            }

            throw new Error("Invalid \"theta\" value \"".concat(theta, "\". Expected an integer number"));

          case 17:
            if (!isNaN(parseInt(p0))) {
              _context2.next = 19;
              break;
            }

            throw new Error("Invalid \"p0\" value \"".concat(p0, "\". Expected an integer number"));

          case 19:
            if (!isNaN(parseInt(initialRaise))) {
              _context2.next = 21;
              break;
            }

            throw new Error("Invalid \"initialRaise\" value \"".concat(initialRaise, "\". Expected an integer number"));

          case 21:
            if (!isNaN(parseInt(friction))) {
              _context2.next = 23;
              break;
            }

            throw new Error("Invalid \"friction\" value \"".concat(friction, "\". Expected an integer number"));

          case 23:
            if (!isNaN(parseInt(hatchDurationSeconds))) {
              _context2.next = 25;
              break;
            }

            throw new Error("Invalid \"hatch duration\" value \"".concat(hatchDurationSeconds, "\". Expected an integer number"));

          case 25:
            if (!isNaN(parseInt(hatchVestingDurationSeconds))) {
              _context2.next = 27;
              break;
            }

            throw new Error("Invalid \"hatch vesting duration\" value \"".concat(hatchVestingDurationSeconds, "\". Expected an integer number"));

          case 27:
            if (!isNaN(parseInt(minExternalContribution))) {
              _context2.next = 29;
              break;
            }

            throw new Error("Invalid \"minExternalContribution\" value \"".concat(minExternalContribution, "\". Expected an integer number"));

          case 29:
            _context2.next = 31;
            return Web3Wrapper.deployContract(web3, {
              from: from,
              useGSN: false,
              abi: artistTokenSc.abi,
              bytecode: artistTokenSc.bytecode,
              params: [owner || from, name, symbol, [wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr], [gasPrice, theta, p0, Web3Wrapper.utils.toWei("".concat(initialRaise)), friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution], reserveRatio]
            });

          case 31:
            receipt = _context2.sent;
            logger("ArtistToken deployed at: ".concat(receipt.contractAddress));
            return _context2.abrupt("return", receipt);

          case 34:
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

module.exports.isArtistTokenHatched =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref6) {
    var artistTokenAddr, isHatched;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            artistTokenAddr = _ref6.artistTokenAddr;
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
            logger("ArtistToken ".concat(artistTokenAddr, " is hatched: ").concat(isHatched));
            return _context3.abrupt("return", isHatched);

          case 7:
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

module.exports.hatchArtistToken =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref8) {
    var from,
        artistTokenAddr,
        wphtAddr,
        amountWeiBn,
        runDepositFirst,
        hatchingAmountInPHT,
        receipt,
        expectedArtistTokens,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref8.from, artistTokenAddr = _ref8.artistTokenAddr, wphtAddr = _ref8.wphtAddr, amountWeiBn = _ref8.amountWeiBn;
            runDepositFirst = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : false;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);
            hatchingAmountInPHT = Web3Wrapper.utils.toPht(amountWeiBn);
            logger("Hatcher ".concat(from, " sent a hatch worth of ").concat(hatchingAmountInPHT, " PHT to artist token ").concat(artistTokenAddr));

            if (!runDepositFirst) {
              _context4.next = 11;
              break;
            }

            _context4.next = 11;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: wphtAddr,
              value: amountWeiBn.toString(),
              useGSN: false,
              method: 'deposit',
              abi: wphtSc.abi,
              params: []
            });

          case 11:
            _context4.next = 13;
            return Web3Wrapper.contractSendTx(web3, {
              to: wphtAddr,
              from: from,
              useGSN: false,
              method: 'approve',
              abi: wphtSc.abi,
              params: [artistTokenAddr, amountWeiBn.toString()]
            });

          case 13:
            _context4.next = 15;
            return Web3Wrapper.contractSendTx(web3, {
              to: artistTokenAddr,
              from: from,
              useGSN: false,
              method: 'hatchContribute',
              gas: 1000000,
              abi: artistTokenSc.abi,
              params: [amountWeiBn.toString()]
            });

          case 15:
            receipt = _context4.sent;
            _context4.next = 18;
            return expectedArtistTokenOfHatchContribution(web3, {
              artistTokenAddr: artistTokenAddr,
              contributionInWPHT: hatchingAmountInPHT
            });

          case 18:
            expectedArtistTokens = _context4.sent;
            logger("Hatched completed, expected ".concat(expectedArtistTokens, " ArtistTokens"));
            return _context4.abrupt("return", receipt);

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();

module.exports.getArtistTokenTotalSupply =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(web3, _ref10) {
    var artistTokenAddr, totalSupply;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            artistTokenAddr = _ref10.artistTokenAddr;
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
            logger("ArtistToken ".concat(artistTokenAddr, " total supply is: ").concat(Web3Wrapper.utils.wei2pht(totalSupply), " PHT"));
            return _context5.abrupt("return", totalSupply);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref9.apply(this, arguments);
  };
}();

module.exports.claimTokens =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(web3, _ref12) {
    var artistTokenAddr, from;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            artistTokenAddr = _ref12.artistTokenAddr, from = _ref12.from;
            _context6.next = 3;
            return Web3Wrapper.contractSendTx(web3, {
              to: artistTokenAddr,
              from: from,
              useGSN: false,
              method: 'claimTokens',
              gas: 1000000,
              abi: artistTokenSc.abi
            });

          case 3:
            return _context6.abrupt("return", _context6.sent);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref11.apply(this, arguments);
  };
}();

module.exports.transfer =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(web3, _ref14) {
    var artistTokenAddr, from, to, amountInBn;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            artistTokenAddr = _ref14.artistTokenAddr, from = _ref14.from, to = _ref14.to, amountInBn = _ref14.amountInBn;
            _context7.next = 3;
            return Web3Wrapper.contractSendTx(web3, {
              to: artistTokenAddr,
              from: from,
              method: 'transfer',
              gas: 1000000,
              abi: artistTokenSc.abi,
              params: [to, amountInBn.toString()]
            });

          case 3:
            return _context7.abrupt("return", _context7.sent);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x13, _x14) {
    return _ref13.apply(this, arguments);
  };
}();

module.exports.transferOwnership =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(web3, _ref16) {
    var artistTokenAddr, from, newOwnerAddr;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            artistTokenAddr = _ref16.artistTokenAddr, from = _ref16.from, newOwnerAddr = _ref16.newOwnerAddr;
            _context8.next = 3;
            return Web3Wrapper.contractSendTx(web3, {
              to: artistTokenAddr,
              from: from,
              method: 'transferOwnership',
              abi: artistTokenSc.abi,
              params: [newOwnerAddr]
            });

          case 3:
            return _context8.abrupt("return", _context8.sent);

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
    return _ref15.apply(this, arguments);
  };
}();

module.exports.approve =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(web3, _ref18) {
    var artistTokenAddr, from, to, amountInBn;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            artistTokenAddr = _ref18.artistTokenAddr, from = _ref18.from, to = _ref18.to, amountInBn = _ref18.amountInBn;
            _context9.next = 3;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: artistTokenAddr,
              method: 'approve',
              abi: wphtSc.abi,
              params: [to, amountInBn.toString()]
            });

          case 3:
            return _context9.abrupt("return", _context9.sent);

          case 4:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x17, _x18) {
    return _ref17.apply(this, arguments);
  };
}();

module.exports.getBalanceOf =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(web3, _ref20) {
    var artistTokenAddr, accountAddr;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            artistTokenAddr = _ref20.artistTokenAddr, accountAddr = _ref20.accountAddr;
            _context10.next = 3;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              method: 'balanceOf',
              abi: artistTokenSc.abi,
              params: [accountAddr]
            });

          case 3:
            return _context10.abrupt("return", _context10.sent);

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x19, _x20) {
    return _ref19.apply(this, arguments);
  };
}();

module.exports.getPoolBalance =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(web3, _ref22) {
    var artistTokenAddr;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            artistTokenAddr = _ref22.artistTokenAddr;
            _context11.next = 3;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              method: 'poolBalance',
              abi: artistTokenSc.abi,
              params: []
            });

          case 3:
            return _context11.abrupt("return", _context11.sent);

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x21, _x22) {
    return _ref21.apply(this, arguments);
  };
}();

module.exports.getRaisedExternalInWPHT =
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(web3, _ref24) {
    var artistTokenAddr;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            artistTokenAddr = _ref24.artistTokenAddr;
            _context12.next = 3;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              method: 'raisedExternal',
              abi: artistTokenSc.abi,
              params: []
            }).then(function (amountInWei) {
              return Web3Wrapper.utils.toPht(amountInWei);
            });

          case 3:
            return _context12.abrupt("return", _context12.sent);

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x23, _x24) {
    return _ref23.apply(this, arguments);
  };
}();

module.exports.getWPHTHatchContributionOf =
/*#__PURE__*/
function () {
  var _ref25 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(web3, _ref26) {
    var artistTokenAddr, accountAddr, preHatchContribution;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            artistTokenAddr = _ref26.artistTokenAddr, accountAddr = _ref26.accountAddr;
            _context13.next = 3;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              abi: artistTokenSc.abi,
              method: 'initialContributions',
              params: [accountAddr]
            });

          case 3:
            preHatchContribution = _context13.sent;
            return _context13.abrupt("return", Web3Wrapper.utils.toPht(preHatchContribution.paidExternal));

          case 5:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x25, _x26) {
    return _ref25.apply(this, arguments);
  };
}();

module.exports.getInitialRaiseInWPHT =
/*#__PURE__*/
function () {
  var _ref27 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(web3, _ref28) {
    var artistTokenAddr, initialRaise;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            artistTokenAddr = _ref28.artistTokenAddr;
            _context14.next = 3;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              abi: artistTokenSc.abi,
              method: 'initialRaise',
              params: []
            });

          case 3:
            initialRaise = _context14.sent;
            return _context14.abrupt("return", Web3Wrapper.utils.toPht(initialRaise));

          case 5:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x27, _x28) {
    return _ref27.apply(this, arguments);
  };
}();

var expectedArtistTokenOfHatchContribution =
/*#__PURE__*/
function () {
  var _ref29 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(web3, _ref30) {
    var artistTokenAddr, contributionInWPHT, p0, theta, DENOMINATOR_PPM;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            artistTokenAddr = _ref30.artistTokenAddr, contributionInWPHT = _ref30.contributionInWPHT;
            _context15.next = 3;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              abi: artistTokenSc.abi,
              method: 'p0',
              params: []
            });

          case 3:
            p0 = _context15.sent;
            _context15.next = 6;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              abi: artistTokenSc.abi,
              method: 'theta',
              params: []
            });

          case 6:
            theta = _context15.sent;
            DENOMINATOR_PPM = 1000000;
            return _context15.abrupt("return", parseFloat(contributionInWPHT) * parseFloat(p0) * (1.0 - parseInt(theta) / DENOMINATOR_PPM));

          case 9:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function expectedArtistTokenOfHatchContribution(_x29, _x30) {
    return _ref29.apply(this, arguments);
  };
}();

module.exports.expectedArtistTokenOfHatchContribution = expectedArtistTokenOfHatchContribution;

var getArtistTokenName =
/*#__PURE__*/
function () {
  var _ref31 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(web3, _ref32) {
    var artistTokenAddr;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            artistTokenAddr = _ref32.artistTokenAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context16.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'name',
              abi: artistTokenSc.abi,
              params: []
            });

          case 4:
            return _context16.abrupt("return", _context16.sent);

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function getArtistTokenName(_x31, _x32) {
    return _ref31.apply(this, arguments);
  };
}();

module.exports.getArtistTokenSymbol = getArtistTokenName;

var getArtistTokenSymbol =
/*#__PURE__*/
function () {
  var _ref33 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(web3, _ref34) {
    var artistTokenAddr;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            artistTokenAddr = _ref34.artistTokenAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            _context17.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'symbol',
              abi: artistTokenSc.abi,
              params: []
            });

          case 4:
            return _context17.abrupt("return", _context17.sent);

          case 5:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function getArtistTokenSymbol(_x33, _x34) {
    return _ref33.apply(this, arguments);
  };
}();

module.exports.getArtistTokenSymbol = getArtistTokenSymbol;

module.exports.getArtistTokenBalanceOf =
/*#__PURE__*/
function () {
  var _ref35 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(web3, _ref36) {
    var artistTokenAddr, accountAddr, symbol, balance;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            artistTokenAddr = _ref36.artistTokenAddr, accountAddr = _ref36.accountAddr;
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);
            _context18.next = 5;
            return getArtistTokenSymbol(web3, {
              artistTokenAddr: artistTokenAddr
            });

          case 5:
            symbol = _context18.sent;
            _context18.next = 8;
            return Web3Wrapper.contractCall(web3, {
              to: artistTokenAddr,
              useGSN: false,
              method: 'balanceOf',
              abi: artistTokenSc.abi,
              params: [accountAddr]
            });

          case 8:
            balance = _context18.sent;
            logger("Account ".concat(accountAddr, " has ").concat(Web3Wrapper.utils.wei2pht(balance.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr));
            return _context18.abrupt("return", Web3Wrapper.utils.toBN(balance));

          case 11:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x35, _x36) {
    return _ref35.apply(this, arguments);
  };
}();

module.exports.buyArtistTokens =
/*#__PURE__*/
function () {
  var _ref37 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee19(web3, _ref38) {
    var from,
        artistTokenAddr,
        wphtAddr,
        amountWeiBn,
        runDepositFirst,
        symbol,
        receipt,
        tokens,
        _args19 = arguments;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            from = _ref38.from, artistTokenAddr = _ref38.artistTokenAddr, wphtAddr = _ref38.wphtAddr, amountWeiBn = _ref38.amountWeiBn;
            runDepositFirst = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : false;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
            Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);
            _context19.next = 8;
            return getArtistTokenSymbol(web3, {
              artistTokenAddr: artistTokenAddr
            });

          case 8:
            symbol = _context19.sent;

            if (!runDepositFirst) {
              _context19.next = 12;
              break;
            }

            _context19.next = 12;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: wphtAddr,
              value: amountWeiBn.toString(),
              method: 'deposit',
              abi: wphtSc.abi,
              params: []
            });

          case 12:
            _context19.next = 14;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: wphtAddr,
              method: 'approve',
              abi: wphtSc.abi,
              params: [artistTokenAddr, amountWeiBn.toString()]
            });

          case 14:
            _context19.next = 16;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: artistTokenAddr,
              method: 'mint',
              gas: 1000000,
              abi: artistTokenSc.abi,
              params: [amountWeiBn.toString()]
            });

          case 16:
            receipt = _context19.sent;
            tokens = receipt.events['CurvedMint'].returnValues['amount'];
            logger("Buyer ".concat(from, " purchased ").concat(tokens.toString(), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr));
            return _context19.abrupt("return", Web3Wrapper.utils.toBN(tokens));

          case 20:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x37, _x38) {
    return _ref37.apply(this, arguments);
  };
}();

module.exports.sellArtistTokens =
/*#__PURE__*/
function () {
  var _ref39 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20(web3, _ref40) {
    var from, artistTokenAddr, amountBn, symbol, receipt, wphtReimbursement;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            from = _ref40.from, artistTokenAddr = _ref40.artistTokenAddr, amountBn = _ref40.amountBn;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
            Web3Wrapper.validator.validateWeiBn("amountBn", amountBn);
            _context20.next = 6;
            return getArtistTokenSymbol(web3, {
              artistTokenAddr: artistTokenAddr
            });

          case 6:
            symbol = _context20.sent;
            _context20.next = 9;
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
            receipt = _context20.sent;
            wphtReimbursement = receipt.events['CurvedBurn'].returnValues['reimbursement'];
            logger("Account ".concat(from, " sold ").concat(Web3Wrapper.utils.wei2pht(amountBn.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr, " for ").concat(Web3Wrapper.utils.wei2pht(wphtReimbursement.toString()), " WPHT"));
            return _context20.abrupt("return", wphtReimbursement);

          case 13:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function (_x39, _x40) {
    return _ref39.apply(this, arguments);
  };
}();