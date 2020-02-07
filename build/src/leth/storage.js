"use strict";

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


module.exports.add = function _callee(web3, gatewayStorage, _ref) {
  var from, owner, file, _ref$isPublic, isPublic, receipt;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          from = _ref.from, owner = _ref.owner, file = _ref.file, _ref$isPublic = _ref.isPublic, isPublic = _ref$isPublic === void 0 ? false : _ref$isPublic;
          Web3Wrapper.validator.validateAddress("from", from);
          Web3Wrapper.validator.validateAddress("owner", owner);
          _context.next = 5;
          return regeneratorRuntime.awrap(acl.create(web3, {
            from: from,
            owner: owner,
            isPublic: isPublic
          }));

        case 5:
          receipt = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(gatewayStorage.addWithAcl(owner, receipt.contractAddress, file));

        case 8:
          return _context.abrupt("return", _context.sent);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};