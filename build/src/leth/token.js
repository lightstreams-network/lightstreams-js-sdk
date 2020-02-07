"use strict";

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 27/11/19 15:15
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

module.exports.generateAuthToken = function _callee2(web3, _ref) {
  var address, tokenBlocksLifespan;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          address = _ref.address, tokenBlocksLifespan = _ref.tokenBlocksLifespan;
          return _context2.abrupt("return", new Promise(function _callee(resolve, reject) {
            var currentBlock, expirationBlock, claims, marshalledClaims;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return regeneratorRuntime.awrap(Web3Wrapper.getBlockNumber(web3));

                  case 3:
                    currentBlock = _context.sent;
                    expirationBlock = currentBlock + tokenBlocksLifespan;
                    claims = {
                      blockchain: "ETH",
                      eth_address: address,
                      iat: currentBlock,
                      eat: expirationBlock
                    };
                    marshalledClaims = JSON.stringify(claims);
                    Web3Wrapper.keystore.signAuthToken(web3, {
                      msg: marshalledClaims,
                      address: address
                    }, function (err, signedMsg) {
                      var marshalledClaimsHexBuffer = new Buffer(marshalledClaims, 'ascii');
                      var encodedClaimsBase64 = marshalledClaimsHexBuffer.toString('base64');
                      var encodedClaimsBase64URLSafe = encodedClaimsBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
                      var sigHexBuffer = new Buffer(Web3Wrapper.utils.stripHexPrefix(signedMsg), 'hex');
                      var encodedSigBase64 = sigHexBuffer.toString('base64');
                      var encodedSigBase64URLSafe = encodedSigBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
                      var token = encodedClaimsBase64URLSafe + "." + encodedSigBase64URLSafe;
                      resolve(token);
                    });
                    _context.next = 13;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](0);
                    reject(_context.t0);

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[0, 10]]);
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};