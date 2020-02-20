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

var acl = require('./acl');
/**
 * Uploads a new file into Smart Vault.
 *
 * @param from {string} Address paying ACL deployment fee
 * @param owner {string} Address of the owner of the file in SC
 * @param file {ReadableStream|File} File to add
 * @param isPublic {boolean} Whenever everyone can read the file content
 *
 * @returns Object{acl: "0xF1E3dC4E704D18783fF58b1f1217f2d82f0b9544", meta: "QmVd6sTUugEUugimMNWLcczhgN3zxunRQmriYQzzi9bRzV"}
 */


module.exports.add =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, gatewayStorage, _ref2) {
    var from, owner, file, _ref2$isPublic, isPublic, receipt;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref2.from, owner = _ref2.owner, file = _ref2.file, _ref2$isPublic = _ref2.isPublic, isPublic = _ref2$isPublic === void 0 ? false : _ref2$isPublic;
            Web3Wrapper.validator.validateAddress("from", from);
            Web3Wrapper.validator.validateAddress("owner", owner);
            _context.next = 5;
            return acl.create(web3, {
              from: from,
              owner: owner,
              isPublic: isPublic
            });

          case 5:
            receipt = _context.sent;
            _context.next = 8;
            return gatewayStorage.addWithAcl(owner, receipt.contractAddress, file);

          case 8:
            return _context.abrupt("return", _context.sent);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();