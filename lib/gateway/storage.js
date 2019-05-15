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

var FormData = require('form-data');

var ADD_FILE_PATH = "/storage/add";
var FETCH_FILE_PATH = "/storage/fetch";

module.exports = function (gwDomain) {
  return {
    /**
     * Uploaded new file into distributed storage
     * @param owner Address of the owner of the file
     * @param password The password that unlocks the owner
     * @param file File to add
     * @returns {StreamResponse<{ meta, acl }>}
     * `meta` refers to the unique identifier for file uploaded into distributed storage
     * `acl` refers to the acl smart contract address
     */
    addProxy: function () {
      var _addProxy = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(owner, password, file) {
        var form, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                form = new FormData();
                form.append('owner', owner);
                form.append('password', password);
                form.append('file', file);
                options = {
                  stream: true,
                  throwHttpErrors: false,
                  headers: form.getHeaders(),
                  body: form
                };
                return _context.abrupt("return", got.post("".concat(gwDomain).concat(ADD_FILE_PATH), options));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function addProxy(_x, _x2, _x3) {
        return _addProxy.apply(this, arguments);
      }

      return addProxy;
    }(),

    /**
     * Fetch file from distributed storage
     * @param meta Unique identifier of stored file
     * @param token Account authentication token
     * @returns {StreamResponse<**CONTENT_FILE**>}
     */
    fetchProxy: function () {
      var _fetchProxy = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(meta, token) {
        var options;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = {
                  stream: true,
                  throwHttpErrors: false,
                  json: true,
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  query: {
                    meta: meta,
                    token: token
                  }
                };
                return _context2.abrupt("return", got.get("".concat(gwDomain).concat(FETCH_FILE_PATH), options));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function fetchProxy(_x4, _x5) {
        return _fetchProxy.apply(this, arguments);
      }

      return fetchProxy;
    }(),

    /**
     * Fetch file from distributed storage
     * @param meta Unique identifier of stored file
     * @param token Account authentication token
     * @param options Got lib options
     */
    fetch: function () {
      var _fetch = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(meta, token) {
        var options,
            defaultOptions,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
                defaultOptions = {
                  throwHttpErrors: true,
                  json: true,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                };
                return _context3.abrupt("return", got.get("".concat(gwDomain).concat(FETCH_FILE_PATH), _objectSpread({}, defaultOptions, options, {
                  query: {
                    meta: meta,
                    token: token
                  }
                })));

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function fetch(_x6, _x7) {
        return _fetch.apply(this, arguments);
      }

      return fetch;
    }(),

    /**
     * Uploaded new file into distributed storage
     * @param owner Address of the owner of the file
     * @param password The password that unlocks the owner
     * @param file File to add
     * @param options Got lib options
     */
    add: function () {
      var _add = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(owner, password, file) {
        var options,
            form,
            defaultOptions,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
                form = new FormData();
                form.append('owner', owner);
                form.append('password', password);
                form.append('file', file);
                defaultOptions = {
                  throwHttpErrors: true,
                  headers: form.getHeaders(),
                  body: form
                };
                return _context4.abrupt("return", got.post("".concat(gwDomain).concat(ADD_FILE_PATH), _objectSpread({}, defaultOptions, options)));

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function add(_x8, _x9, _x10) {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  };
};