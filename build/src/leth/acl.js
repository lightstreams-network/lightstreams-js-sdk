"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 11/12/19 10:10
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

var aclSc = require('../../build/contracts/ACL.json');

module.exports.create =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref2) {
    var from, owner, _ref2$isPublic, isPublic;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref2.from, owner = _ref2.owner, _ref2$isPublic = _ref2.isPublic, isPublic = _ref2$isPublic === void 0 ? false : _ref2$isPublic;
            _context.next = 3;
            return Web3Wrapper.deployContract(web3, {
              from: from,
              useGSN: false,
              abi: aclSc.abi,
              bytecode: aclSc.bytecode,
              params: [owner, isPublic]
            });

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
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

module.exports.grantRead =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref4) {
    var from, contractAddr, account;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref4.from, contractAddr = _ref4.contractAddr, account = _ref4.account;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("account", account);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context2.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'grantRead',
              params: [account]
            });

          case 6:
            return _context2.abrupt("return", _context2.sent);

          case 7:
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

module.exports.grantWrite =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref6) {
    var from, contractAddr, account;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            from = _ref6.from, contractAddr = _ref6.contractAddr, account = _ref6.account;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("account", account);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context3.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'grantWrite',
              params: [account]
            });

          case 6:
            return _context3.abrupt("return", _context3.sent);

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

module.exports.grantAdmin =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref8) {
    var from, contractAddr, account;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref8.from, contractAddr = _ref8.contractAddr, account = _ref8.account;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("account", account);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context4.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'grantAdmin',
              params: [account]
            });

          case 6:
            return _context4.abrupt("return", _context4.sent);

          case 7:
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

module.exports.revokeAccess =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(web3, _ref10) {
    var from, contractAddr, account;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            from = _ref10.from, contractAddr = _ref10.contractAddr, account = _ref10.account;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("account", account);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context5.next = 6;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'revokeAccess',
              params: [account]
            });

          case 6:
            return _context5.abrupt("return", _context5.sent);

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

module.exports.grantPublicAccess =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(web3, _ref12) {
    var from, contractAddr;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            from = _ref12.from, contractAddr = _ref12.contractAddr;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context6.next = 5;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'grantPublicAccess',
              params: []
            });

          case 5:
            return _context6.abrupt("return", _context6.sent);

          case 6:
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

module.exports.revokePublicAccess =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(web3, _ref14) {
    var from, contractAddr;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            from = _ref14.from, contractAddr = _ref14.contractAddr;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context7.next = 5;
            return Web3Wrapper.contractSendTx(web3, {
              from: from,
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'revokePublicAccess',
              params: []
            });

          case 5:
            return _context7.abrupt("return", _context7.sent);

          case 6:
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

module.exports.hasRead =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(web3, _ref16) {
    var contractAddr, account;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            contractAddr = _ref16.contractAddr, account = _ref16.account;
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            Web3Wrapper.validator.validateAddress("account", account);
            _context8.next = 5;
            return Web3Wrapper.contractCall(web3, {
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'hasRead',
              params: [account]
            });

          case 5:
            return _context8.abrupt("return", _context8.sent);

          case 6:
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

module.exports.hasAdmin =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(web3, _ref18) {
    var contractAddr, account;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            contractAddr = _ref18.contractAddr, account = _ref18.account;
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            Web3Wrapper.validator.validateAddress("account", account);
            _context9.next = 5;
            return Web3Wrapper.contractCall(web3, {
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'hasAdmin',
              params: [account]
            });

          case 5:
            return _context9.abrupt("return", _context9.sent);

          case 6:
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

module.exports.getOwner =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(web3, _ref20) {
    var contractAddr;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            contractAddr = _ref20.contractAddr;
            Web3Wrapper.validator.validateAddress("contractAddr", contractAddr);
            _context10.next = 4;
            return Web3Wrapper.contractCall(web3, {
              to: contractAddr,
              useGSN: false,
              abi: aclSc.abi,
              method: 'getOwner',
              params: []
            });

          case 4:
            return _context10.abrupt("return", _context10.sent);

          case 5:
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