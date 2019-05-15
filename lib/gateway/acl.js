"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var got = require('got');

var _require = require('../lib/response'),
    parseResponse = _require.parseResponse,
    errorResponse = _require.errorResponse;

var _require2 = require('../lib/request'),
    defaultOptions = _require2.defaultOptions;

var GRANT_PERMISSIONS_PATH = '/acl/grant';
var PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports = function (gwDomain) {
  return {
    /**
     * Grant certain file permissions to an account
     * @param acl ACL address obtained after storing a file
     * @param owner Account address of file's owner
     * @param password The password that unlocks the account
     * @param to Account address that will receive the permissions
     * @param permission Permission type to grant (Enum:"read" "write" "admin")
     * @returns {Promise<{ is_granted }>}
     */
    grant: function () {
      var _grant = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(acl, owner, password, to, permission) {
        var options, gwResponse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(Object.values(PERMISSIONS).indexOf(permission) === -1)) {
                  _context.next = 2;
                  break;
                }

                throw errorResponse("\"".concat(permission, "\" is not a valid permission"));

              case 2:
                options = _objectSpread({}, defaultOptions, {
                  body: {
                    acl: acl,
                    owner: owner,
                    password: password,
                    to: to,
                    permission: permission
                  }
                });
                _context.next = 5;
                return got.post("".concat(gwDomain).concat(GRANT_PERMISSIONS_PATH), options);

              case 5:
                gwResponse = _context.sent;
                return _context.abrupt("return", parseResponse(gwResponse));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function grant(_x, _x2, _x3, _x4, _x5) {
        return _grant.apply(this, arguments);
      }

      return grant;
    }()
  };
};