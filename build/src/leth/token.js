"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 27/11/19 15:15
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3Wrapper = require('../web3');

module.exports.generateAuthToken =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref2) {
    var address, tokenBlocksLifespan;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            address = _ref2.address, tokenBlocksLifespan = _ref2.tokenBlocksLifespan;
            return _context2.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(resolve, reject) {
                var currentBlock, expirationBlock, claims, marshalledClaims;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return Web3Wrapper.getBlockNumber(web3);

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
                }, _callee, null, [[0, 10]]);
              }));

              return function (_x3, _x4) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();