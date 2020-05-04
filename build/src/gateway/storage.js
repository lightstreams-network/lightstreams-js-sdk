"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var ADD_FILE_PATH = "/storage/add";
var ADD_RAW_PATH = "/storage/add-raw";
var UPDATE_FILE_PATH = "/storage/update";
var UPDATE_RAW_PATH = "/storage/update-raw";
var ADD_FILE_WITH_ACL_PATH = "/storage/add-with-acl";
var ADD_RAW_WITH_ACL_PATH = "/storage/add-raw-with-acl";
var FETCH_FILE_PATH = "/storage/fetch";
var STREAM_FILE_PATH = "/storage/stream";
var META_PATH = "/storage/meta";
var STATUS_PATH = "/storage/status";

var request = require('../http/request');

var _require = require('../leth/cid'),
    validateCid = _require.validateCid;

module.exports = function (gwDomain) {
  return {
    /**
     * Uploaded new file into distributed storage
     * @param owner {string} Address of the owner of the file
     * @param password {string} The password that unlocks the owner
     * @param file {ReadableStream|File} File to add
     * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
     */
    add: function add(owner, password, file) {
      if (typeof File !== 'undefined' && file instanceof File) {
        var reader = new FileReader();
        var fileBlob = file.slice(0, file.size);
        reader.readAsBinaryString(fileBlob);
      }

      return request.postFile("".concat(gwDomain).concat(ADD_FILE_PATH), {
        owner: owner,
        password: password
      }, file);
    },

    /**
     * Uploaded new file into distributed storage using raw data and fixed file type
     * @param owner {string} Address of the owner of the file
     * @param password {string} The password that unlocks the owner
     * @param rawData {string} File content in blob object
     * @param ext {string} Content extension format. For example: '.json', '.png'..
     * @returns { meta, acl }
     */
    addRaw: function addRaw(owner, password, rawData, ext) {
      if (typeof rawData !== 'string') {
        throw new Exception("Argument \"data\" must be an string");
      }

      return request.post("".concat(gwDomain).concat(ADD_RAW_PATH), {
        owner: owner,
        password: password,
        data: rawData,
        ext: ext
      });
    },

    /**
     * Uploaded new file into distributed storage using an already deployed acl
     * @param owner {string} Address of the owner of the file
     * @param acl {string} Address to acl contract
     * @param file {ReadableStream|File} File to add
     * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
     */
    addWithAcl: function addWithAcl(owner, acl, file) {
      if (typeof File !== 'undefined' && file instanceof File) {
        var reader = new FileReader();
        var fileBlob = file.slice(0, file.size);
        reader.readAsBinaryString(fileBlob);
      }

      return request.postFile("".concat(gwDomain).concat(ADD_FILE_WITH_ACL_PATH), {
        owner: owner,
        acl: acl
      }, file);
    },

    /**
     * Uploaded new file into distributed storage using raw data and fixed file extension and using an already deployed acl
     * @param owner {string} Address of the owner of the file
     * @param acl {string} {string} Address to acl contract
     * @param rawData {string} File content in blob object
     * @param ext {string} Content extension format. For example: '.json', '.png'..
     * @returns { meta, acl }
     */
    addRawWithAcl: function addRawWithAcl(owner, acl, rawData, ext) {
      if (typeof rawData !== 'string') {
        throw new Error("Argument \"data\" must be an string");
      }

      return request.post("".concat(gwDomain).concat(ADD_RAW_WITH_ACL_PATH), {
        owner: owner,
        acl: acl,
        data: rawData,
        ext: ext
      });
    },

    /**
     * Update distributed file content and link it to previous version
     * @param owner {string} Address of the owner of the file
     * @param meta {string} Unique identifier of stored file
     * @param file {ReadableStream|File} File to add
     * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
     */
    update: function update(owner, meta, file) {
      validateCid(meta);

      if (typeof File !== 'undefined' && file instanceof File) {
        var reader = new FileReader();
        var fileBlob = file.slice(0, file.size);
        reader.readAsBinaryString(fileBlob);
      }

      return request.postFile("".concat(gwDomain).concat(UPDATE_FILE_PATH), {
        meta: meta,
        owner: owner
      }, file);
    },

    /**
     * Uploaded new file into distributed storage using raw data and fixed file extension
     * @param owner {string} Address of the owner of the file
     * @param password {string} The password that unlocks the owner
     * @param rawData {string} File content in blob object
     * @param ext {string} Content extension format. For example: '.json', '.png'..
     * @returns { meta, acl }
     */
    updateRaw: function updateRaw(owner, password, rawData, ext) {
      if (typeof rawData !== 'string') {
        throw new Error("Argument \"data\" must be a Blob");
      }

      return request.post("".concat(gwDomain).concat(UPDATE_RAW_PATH), {
        owner: owner,
        password: password,
        data: rawData,
        ext: ext
      });
    },

    /**
     * Fetch file from distributed storage
     * @param meta {string} Unique identifier of stored file
     * @param token {string} Account authentication token
     * @param stream {boolean} Response to be streamed or not
     * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
     */
    fetch: function fetch(meta, token, stream) {
      validateCid(meta);
      var reqData = {
        meta: meta
      };

      if (token) {
        reqData = _objectSpread({}, reqData, {
          token: token
        });
      }

      return request.fetchFile("".concat(gwDomain).concat(FETCH_FILE_PATH), reqData, {
        stream: stream,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },

    /**
     * Return an string with the GET url to fetch content from distributed storage
     * @param meta {string} Unique identifier of stored file
     * @param token {string} Account authentication token
     */
    fetchUrl: function fetchUrl(meta, token) {
      validateCid(meta);

      if (!token) {
        return "".concat(gwDomain).concat(FETCH_FILE_PATH, "?meta=").concat(meta);
      }

      return "".concat(gwDomain).concat(FETCH_FILE_PATH, "?meta=").concat(meta, "&token=").concat(encodeURI(token));
    },

    /**
     * Stream file from distributed storage
     * @param meta {string} Unique identifier of stored file
     * @param token {string} Account authentication token
     * @param stream {boolean} Response to be streamed or not
     * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
     */
    stream: function stream(meta, token, _stream) {
      validateCid(meta);
      var reqData = {
        meta: meta
      };

      if (token) {
        reqData = _objectSpread({}, reqData, {
          token: token
        });
      }

      return request.fetchFile("".concat(gwDomain).concat(STREAM_FILE_PATH), reqData, {
        stream: _stream,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },

    /**
     * Return an string with the GET url to fetch content from distributed storage
     * @param meta {string} Unique identifier of stored file
     * @param token {string} Account authentication token
     */
    streamUrl: function streamUrl(meta, token) {
      validateCid(meta);

      if (!token) {
        return "".concat(gwDomain).concat(STREAM_FILE_PATH, "?meta=").concat(meta);
      }

      return "".concat(gwDomain).concat(STREAM_FILE_PATH, "?meta=").concat(meta, "&token=").concat(encodeURI(token));
    },

    /**
     * Fetch metadata information about distributed file
     * @param meta {string} Unique identifier of stored file
     * @returns {Promise<{ filename, owner, ext, hash, acl, acl, prev_meta_hash }>}
     */
    meta: function meta(_meta) {
      validateCid(_meta);
      return request.get("".concat(gwDomain).concat(META_PATH), {
        meta: _meta
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },

    /**
     * Fetch information about the Smart Vault node.
     *
     * @returns {Promise<{ peer_id: <string>, }>}
     */
    status: function status() {
      return request.get("".concat(gwDomain).concat(STATUS_PATH), {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};