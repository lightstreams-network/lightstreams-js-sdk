"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var ADD_FILE_PATH = "/storage/add";
var FETCH_FILE_PATH = "/storage/fetch";

var request = require('../lib/request');

module.exports = function (gwDomain) {
  return {
    /**
     * Uploaded new file into distributed storage
     * @param owner Address of the owner of the file
     * @param password The password that unlocks the owner
     * @param file File to add
     * @param stream stream file up
     * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
     * `meta` refers to the unique identifier for file uploaded into distributed storage
     * `acl` refers to the acl smart contract address
     */
    add: function add(owner, password, file) {
      var stream = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var options = stream ? {
        stream: true,
        throwHttpErrors: false
      } : {
        stream: false,
        throwHttpErrors: true
      };
      return request.postFile("".concat(gwDomain).concat(ADD_FILE_PATH), {
        owner: owner,
        password: password
      }, file, options);
    },

    /**
     * Fetch file from distributed storage
     * @param meta Unique identifier of stored file
     * @param token Account authentication token
     * @param stream stream file up
     * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
     */
    fetch: function fetch(meta, token) {
      var stream = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var options = stream ? {
        stream: true,
        throwHttpErrors: false
      } : {
        stream: false,
        throwHttpErrors: true
      };
      return request.fetchFile("".concat(gwDomain).concat(FETCH_FILE_PATH), {
        meta: meta,
        token: token
      }, _objectSpread({}, options, {
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    }
  };
};