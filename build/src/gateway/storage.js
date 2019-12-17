"use strict";

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
var META_PATH = "/storage/meta";

var request = require('../http/request');

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
     * @param data {Blob} File content in blob object
     * @param ext {string} Content extension format. For example: '.json', '.png'..
     * @returns { meta, acl }
     */
    addRaw: function addRaw(owner, password, data, ext) {
      if (!data instanceof Blob) {
        throw new Exception("Argument \"data\" must be a Blob");
      }

      return data.text().then(function (rawData) {
        return request.post("".concat(gwDomain).concat(ADD_RAW_PATH), {
          owner: owner,
          password: password,
          data: rawData,
          ext: ext
        });
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
     * @param data {Blob} File content in blob object
     * @param ext {string} Content extension format. For example: '.json', '.png'..
     * @returns { meta, acl }
     */
    addRawWithAcl: function addRawWithAcl(owner, acl, data, ext) {
      if (!data instanceof Blob) {
        throw new Exception("Argument \"data\" must be a Blob");
      }

      return data.text().then(function (rawData) {
        return request.post("".concat(gwDomain).concat(ADD_RAW_WITH_ACL_PATH), {
          owner: owner,
          acl: acl,
          data: rawData,
          ext: ext
        });
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
     * @param data {Blob} File content in blob object
     * @param ext {string} Content extension format. For example: '.json', '.png'..
     * @returns { meta, acl }
     */
    updateRaw: function updateRaw(owner, password, data, ext) {
      if (!data instanceof Blob) {
        throw new Exception("Argument \"data\" must be a Blob");
      }

      return data.text().then(function (rawData) {
        return request.post("".concat(gwDomain).concat(UPDATE_RAW_PATH), {
          owner: owner,
          password: password,
          data: rawData,
          ext: ext
        });
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
      return request.fetchFile("".concat(gwDomain).concat(FETCH_FILE_PATH), {
        meta: meta,
        token: token
      }, {
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
      if (!token) {
        return "".concat(gwDomain).concat(FETCH_FILE_PATH, "?meta=").concat(meta);
      }

      return "".concat(gwDomain).concat(FETCH_FILE_PATH, "?meta=").concat(meta, "&token=").concat(encodeURI(token));
    },

    /**
     * Fetch metadata information about distributed file
     * @param meta {string} Unique identifier of stored file
     * @returns {Promise<{ filename, owner, ext, hash, acl, acl, prev_meta_hash }>}
     */
    meta: function meta(_meta) {
      return request.get("".concat(gwDomain).concat(META_PATH), {
        meta: _meta
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};