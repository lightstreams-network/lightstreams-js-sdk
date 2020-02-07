"use strict";

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 11/12/19 10:10
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var aclSc = require('../../build/contracts/ACL.json');

module.exports.create = function _callee(web3, _ref) {
  var from, owner, _ref$isPublic, isPublic;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          from = _ref.from, owner = _ref.owner, _ref$isPublic = _ref.isPublic, isPublic = _ref$isPublic === void 0 ? false : _ref$isPublic;
          _context.next = 3;
          return regeneratorRuntime.awrap(Web3Wrapper.deployContract(web3, {
            from: from,
            useGSN: false,
            abi: aclSc.abi,
            bytecode: aclSc.bytecode,
            params: [owner, isPublic]
          }));

        case 3:
          return _context.abrupt("return", _context.sent);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.grantRead = function _callee2(web3, _ref2) {
  var from, contractAddr, account;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          from = _ref2.from, contractAddr = _ref2.contractAddr, account = _ref2.account;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("account", account);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context2.next = 6;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'grantRead',
            params: [account]
          }));

        case 6:
          return _context2.abrupt("return", _context2.sent);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.grantWrite = function _callee3(web3, _ref3) {
  var from, contractAddr, account;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          from = _ref3.from, contractAddr = _ref3.contractAddr, account = _ref3.account;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("account", account);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context3.next = 6;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'grantWrite',
            params: [account]
          }));

        case 6:
          return _context3.abrupt("return", _context3.sent);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.grantAdmin = function _callee4(web3, _ref4) {
  var from, contractAddr, account;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          from = _ref4.from, contractAddr = _ref4.contractAddr, account = _ref4.account;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("account", account);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context4.next = 6;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'grantAdmin',
            params: [account]
          }));

        case 6:
          return _context4.abrupt("return", _context4.sent);

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.revokeAccess = function _callee5(web3, _ref5) {
  var from, contractAddr, account;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          from = _ref5.from, contractAddr = _ref5.contractAddr, account = _ref5.account;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("account", account);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context5.next = 6;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'revokeAccess',
            params: [account]
          }));

        case 6:
          return _context5.abrupt("return", _context5.sent);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.grantPublicAccess = function _callee6(web3, _ref6) {
  var from, contractAddr;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          from = _ref6.from, contractAddr = _ref6.contractAddr;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context6.next = 5;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'grantPublicAccess',
            params: []
          }));

        case 5:
          return _context6.abrupt("return", _context6.sent);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.revokePublicAccess = function _callee7(web3, _ref7) {
  var from, contractAddr;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          from = _ref7.from, contractAddr = _ref7.contractAddr;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context7.next = 5;
          return regeneratorRuntime.awrap(Web3Wrapper.contractSendTx(web3, {
            from: from,
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'revokePublicAccess',
            params: []
          }));

        case 5:
          return _context7.abrupt("return", _context7.sent);

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.hasRead = function _callee8(web3, _ref8) {
  var contractAddr, account;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          contractAddr = _ref8.contractAddr, account = _ref8.account;
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          Web3Wrapper.validator.validateAddress("account", account);
          _context8.next = 5;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'hasRead',
            params: [account]
          }));

        case 5:
          return _context8.abrupt("return", _context8.sent);

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.hasAdmin = function _callee9(web3, _ref9) {
  var contractAddr, account;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          contractAddr = _ref9.contractAddr, account = _ref9.account;
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          Web3Wrapper.validator.validateAddress("account", account);
          _context9.next = 5;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'hasAdmin',
            params: [account]
          }));

        case 5:
          return _context9.abrupt("return", _context9.sent);

        case 6:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.getOwner = function _callee10(web3, _ref10) {
  var contractAddr;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          contractAddr = _ref10.contractAddr;
          Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
          _context10.next = 4;
          return regeneratorRuntime.awrap(Web3Wrapper.contractCall(web3, {
            to: contractAddr,
            useGSN: false,
            abi: aclSc.abi,
            method: 'getOwner',
            params: []
          }));

        case 4:
          return _context10.abrupt("return", _context10.sent);

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
};