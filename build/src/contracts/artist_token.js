"use strict";

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var artistTokenSc = require('../../build/contracts/ArtistToken.json');

var fundingPoolSc = require('../../build/contracts/FundingPool.json');

var wphtSc = require('../../build/contracts/WPHT.json');

module.exports.deployFundingPool = function _callee(web3, _ref) {
  var from, receipt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          from = _ref.from;
          Web3Wrapper.validator.validateAddress("from", from);
          _context.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.deployContract(web3, {
            from: from,
            useGSN: false,
            abi: fundingPoolSc.abi,
            bytecode: fundingPoolSc.bytecode,
            params: []
          }));

        case 4:
          receipt = _context.sent;
          console.log("FundingPool deployed at: ".concat(receipt.contractAddress));
          return _context.abrupt("return", receipt);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.deployArtistToken = function _callee2(web3, _ref2) {
  var from, name, symbol, wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr, reserveRatio, gasPrice, theta, p0, initialRaise, friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution, receipt;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          from = _ref2.from, name = _ref2.name, symbol = _ref2.symbol, wphtAddr = _ref2.wphtAddr, fundingPoolAddr = _ref2.fundingPoolAddr, feeRecipientAddr = _ref2.feeRecipientAddr, pauserAddr = _ref2.pauserAddr, reserveRatio = _ref2.reserveRatio, gasPrice = _ref2.gasPrice, theta = _ref2.theta, p0 = _ref2.p0, initialRaise = _ref2.initialRaise, friction = _ref2.friction, hatchDurationSeconds = _ref2.hatchDurationSeconds, hatchVestingDurationSeconds = _ref2.hatchVestingDurationSeconds, minExternalContribution = _ref2.minExternalContribution;

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
          return regeneratorRuntime.awrap(Web3Wrapper.deployContract(web3, {
            from: from,
            useGSN: false,
            abi: artistTokenSc.abi,
            bytecode: artistTokenSc.bytecode,
            params: [name, symbol, [wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr], [gasPrice, theta, p0, Web3Wrapper.utils.toWei("".concat(initialRaise)), friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution], reserveRatio]
          }));

        case 30:
          receipt = _context2.sent;
          console.log("ArtistToken deployed at: ".concat(receipt.contractAddress));
          return _context2.abrupt("return", receipt);

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.isArtistTokenHatched = function _callee3(web3, _ref3) {
  var artistTokenAddr, isHatched;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          artistTokenAddr = _ref3.artistTokenAddr;
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          _context3.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            useGSN: false,
            method: 'isHatched',
            abi: artistTokenSc.abi,
            params: []
          }));

        case 4:
          isHatched = _context3.sent;
          console.log("ArtistToken ".concat(artistTokenAddr, " is hatched: ").concat(isHatched));
          return _context3.abrupt("return", isHatched);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.hatchArtistToken = function _callee4(web3, _ref4) {
  var from,
      artistTokenAddr,
      wphtAddr,
      amountWeiBn,
      runDepositFirst,
      hatchingAmountInPHT,
      receipt,
      expectedArtistTokens,
      _args4 = arguments;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          from = _ref4.from, artistTokenAddr = _ref4.artistTokenAddr, wphtAddr = _ref4.wphtAddr, amountWeiBn = _ref4.amountWeiBn;
          runDepositFirst = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : false;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
          Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);
          hatchingAmountInPHT = Web3Wrapper.utils.toPht(amountWeiBn);
          console.log("Hatcher ".concat(from, " sent a hatch worth of ").concat(hatchingAmountInPHT, " PHT to artist token ").concat(artistTokenAddr));

          if (!runDepositFirst) {
            _context4.next = 11;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: wphtAddr,
            value: amountWeiBn.toString(),
            useGSN: false,
            method: 'deposit',
            abi: wphtSc.abi,
            params: []
          }));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            to: wphtAddr,
            from: from,
            useGSN: false,
            method: 'approve',
            abi: wphtSc.abi,
            params: [artistTokenAddr, amountWeiBn.toString()]
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            to: artistTokenAddr,
            from: from,
            useGSN: false,
            method: 'hatchContribute',
            gas: 1000000,
            abi: artistTokenSc.abi,
            params: [amountWeiBn.toString()]
          }));

        case 15:
          receipt = _context4.sent;
          _context4.next = 18;
          return regeneratorRuntime.awrap(expectedArtistTokenOfHatchContribution(web3, {
            artistTokenAddr: artistTokenAddr,
            contributionInWPHT: hatchingAmountInPHT
          }));

        case 18:
          expectedArtistTokens = _context4.sent;
          console.log("Hatched completed, expected ".concat(expectedArtistTokens, " ArtistTokens"));
          return _context4.abrupt("return", receipt);

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.getArtistTokenTotalSupply = function _callee5(web3, _ref5) {
  var artistTokenAddr, totalSupply;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          artistTokenAddr = _ref5.artistTokenAddr;
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          _context5.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            useGSN: false,
            method: 'totalSupply',
            abi: artistTokenSc.abi,
            params: []
          }));

        case 4:
          totalSupply = _context5.sent;
          console.log("ArtistToken ".concat(artistTokenAddr, " total supply is: ").concat(Web3Wrapper.utils.wei2pht(totalSupply), " PHT"));
          return _context5.abrupt("return", totalSupply);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.claimTokens = function _callee6(web3, _ref6) {
  var artistTokenAddr, from;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          artistTokenAddr = _ref6.artistTokenAddr, from = _ref6.from;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            to: artistTokenAddr,
            from: from,
            useGSN: false,
            method: 'claimTokens',
            gas: 1000000,
            abi: artistTokenSc.abi
          }));

        case 3:
          return _context6.abrupt("return", _context6.sent);

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.transfer = function _callee7(web3, _ref7) {
  var artistTokenAddr, from, to, amountInBn;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          artistTokenAddr = _ref7.artistTokenAddr, from = _ref7.from, to = _ref7.to, amountInBn = _ref7.amountInBn;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            to: artistTokenAddr,
            from: from,
            method: 'transfer',
            gas: 1000000,
            abi: artistTokenSc.abi,
            params: [to, amountInBn.toString()]
          }));

        case 3:
          return _context7.abrupt("return", _context7.sent);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.approve = function _callee8(web3, _ref8) {
  var artistTokenAddr, from, to, amountInBn;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          artistTokenAddr = _ref8.artistTokenAddr, from = _ref8.from, to = _ref8.to, amountInBn = _ref8.amountInBn;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: artistTokenAddr,
            method: 'approve',
            abi: wphtSc.abi,
            params: [to, amountInBn.toString()]
          }));

        case 3:
          return _context8.abrupt("return", _context8.sent);

        case 4:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.getBalanceOf = function _callee9(web3, _ref9) {
  var artistTokenAddr, accountAddr;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          artistTokenAddr = _ref9.artistTokenAddr, accountAddr = _ref9.accountAddr;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            method: 'balanceOf',
            abi: artistTokenSc.abi,
            params: [accountAddr]
          }));

        case 3:
          return _context9.abrupt("return", _context9.sent);

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.getPoolBalance = function _callee10(web3, _ref10) {
  var artistTokenAddr;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          artistTokenAddr = _ref10.artistTokenAddr;
          _context10.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            method: 'poolBalance',
            abi: artistTokenSc.abi,
            params: []
          }));

        case 3:
          return _context10.abrupt("return", _context10.sent);

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
};

module.exports.getRaisedExternalInWPHT = function _callee11(web3, _ref11) {
  var artistTokenAddr;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          artistTokenAddr = _ref11.artistTokenAddr;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            method: 'raisedExternal',
            abi: artistTokenSc.abi,
            params: []
          }).then(function (amountInWei) {
            return Web3Wrapper.utils.toPht(amountInWei);
          }));

        case 3:
          return _context11.abrupt("return", _context11.sent);

        case 4:
        case "end":
          return _context11.stop();
      }
    }
  });
};

module.exports.getWPHTHatchContributionOf = function _callee12(web3, _ref12) {
  var artistTokenAddr, accountAddr, preHatchContribution;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          artistTokenAddr = _ref12.artistTokenAddr, accountAddr = _ref12.accountAddr;
          _context12.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            abi: artistTokenSc.abi,
            method: 'initialContributions',
            params: [accountAddr]
          }));

        case 3:
          preHatchContribution = _context12.sent;
          return _context12.abrupt("return", Web3Wrapper.utils.toPht(preHatchContribution.paidExternal));

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
};

var expectedArtistTokenOfHatchContribution = function expectedArtistTokenOfHatchContribution(web3, _ref13) {
  var artistTokenAddr, contributionInWPHT, p0;
  return regeneratorRuntime.async(function expectedArtistTokenOfHatchContribution$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          artistTokenAddr = _ref13.artistTokenAddr, contributionInWPHT = _ref13.contributionInWPHT;
          _context13.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            abi: artistTokenSc.abi,
            method: 'p0',
            params: []
          }));

        case 3:
          p0 = _context13.sent;
          return _context13.abrupt("return", parseFloat(contributionInWPHT) * parseFloat(p0));

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
};

module.exports.expectedArtistTokenOfHatchContribution = expectedArtistTokenOfHatchContribution;

var getArtistTokenName = function getArtistTokenName(web3, _ref14) {
  var artistTokenAddr;
  return regeneratorRuntime.async(function getArtistTokenName$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          artistTokenAddr = _ref14.artistTokenAddr;
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          _context14.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            useGSN: false,
            method: 'name',
            abi: artistTokenSc.abi,
            params: []
          }));

        case 4:
          return _context14.abrupt("return", _context14.sent);

        case 5:
        case "end":
          return _context14.stop();
      }
    }
  });
};

module.exports.getArtistTokenSymbol = getArtistTokenName;

var getArtistTokenSymbol = function getArtistTokenSymbol(web3, _ref15) {
  var artistTokenAddr;
  return regeneratorRuntime.async(function getArtistTokenSymbol$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          artistTokenAddr = _ref15.artistTokenAddr;
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          _context15.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            useGSN: false,
            method: 'symbol',
            abi: artistTokenSc.abi,
            params: []
          }));

        case 4:
          return _context15.abrupt("return", _context15.sent);

        case 5:
        case "end":
          return _context15.stop();
      }
    }
  });
};

module.exports.getArtistTokenSymbol = getArtistTokenSymbol;

module.exports.getArtistTokenBalanceOf = function _callee13(web3, _ref16) {
  var artistTokenAddr, accountAddr, symbol, balance;
  return regeneratorRuntime.async(function _callee13$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          artistTokenAddr = _ref16.artistTokenAddr, accountAddr = _ref16.accountAddr;
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);
          _context16.next = 5;
          return regeneratorRuntime.awrap(getArtistTokenSymbol(web3, {
            artistTokenAddr: artistTokenAddr
          }));

        case 5:
          symbol = _context16.sent;
          _context16.next = 8;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: artistTokenAddr,
            useGSN: false,
            method: 'balanceOf',
            abi: artistTokenSc.abi,
            params: [accountAddr]
          }));

        case 8:
          balance = _context16.sent;
          console.log("Account ".concat(accountAddr, " has ").concat(Web3Wrapper.utils.wei2pht(balance.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr));
          return _context16.abrupt("return", Web3Wrapper.utils.toBN(balance));

        case 11:
        case "end":
          return _context16.stop();
      }
    }
  });
};

module.exports.buyArtistTokens = function _callee14(web3, _ref17) {
  var from,
      artistTokenAddr,
      wphtAddr,
      amountWeiBn,
      runDepositFirst,
      symbol,
      receipt,
      tokens,
      _args17 = arguments;
  return regeneratorRuntime.async(function _callee14$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          from = _ref17.from, artistTokenAddr = _ref17.artistTokenAddr, wphtAddr = _ref17.wphtAddr, amountWeiBn = _ref17.amountWeiBn;
          runDepositFirst = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : false;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
          Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);
          _context17.next = 8;
          return regeneratorRuntime.awrap(getArtistTokenSymbol(web3, {
            artistTokenAddr: artistTokenAddr
          }));

        case 8:
          symbol = _context17.sent;

          if (!runDepositFirst) {
            _context17.next = 12;
            break;
          }

          _context17.next = 12;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: wphtAddr,
            value: amountWeiBn.toString(),
            method: 'deposit',
            abi: wphtSc.abi,
            params: []
          }));

        case 12:
          _context17.next = 14;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: wphtAddr,
            method: 'approve',
            abi: wphtSc.abi,
            params: [artistTokenAddr, amountWeiBn.toString()]
          }));

        case 14:
          _context17.next = 16;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: artistTokenAddr,
            method: 'mint',
            gas: 1000000,
            abi: artistTokenSc.abi,
            params: [amountWeiBn.toString()]
          }));

        case 16:
          receipt = _context17.sent;
          tokens = receipt.events['CurvedMint'].returnValues['amount'];
          console.log("Buyer ".concat(from, " purchased ").concat(tokens.toString(), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr));
          return _context17.abrupt("return", Web3Wrapper.utils.toBN(tokens));

        case 20:
        case "end":
          return _context17.stop();
      }
    }
  });
};

module.exports.sellArtistTokens = function _callee15(web3, _ref18) {
  var from, artistTokenAddr, amountBn, symbol, receipt, wphtReimbursement;
  return regeneratorRuntime.async(function _callee15$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          from = _ref18.from, artistTokenAddr = _ref18.artistTokenAddr, amountBn = _ref18.amountBn;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
          Web3Wrapper.validator.validateWeiBn("amountBn", amountBn);
          _context18.next = 6;
          return regeneratorRuntime.awrap(getArtistTokenSymbol(web3, {
            artistTokenAddr: artistTokenAddr
          }));

        case 6:
          symbol = _context18.sent;
          _context18.next = 9;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: artistTokenAddr,
            useGSN: false,
            method: 'burn',
            gas: 1000000,
            abi: artistTokenSc.abi,
            params: [amountBn.toString()]
          }));

        case 9:
          receipt = _context18.sent;
          wphtReimbursement = receipt.events['CurvedBurn'].returnValues['reimbursement'];
          console.log("Account ".concat(from, " sold ").concat(Web3Wrapper.utils.wei2pht(amountBn.toString()), " ").concat(symbol, " of ArtistToken ").concat(artistTokenAddr, " for ").concat(Web3Wrapper.utils.wei2pht(wphtReimbursement.toString()), " WPHT"));
          return _context18.abrupt("return", wphtReimbursement);

        case 13:
        case "end":
          return _context18.stop();
      }
    }
  });
};