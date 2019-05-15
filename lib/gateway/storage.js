"use strict";

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
     * @param owner {string} Address of the owner of the file
     * @param password {string} The password that unlocks the owner
     * @param file {ReadableStream} File to add
     * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
     */
    add: function add(owner, password, file) {
      return request.postFile("".concat(gwDomain).concat(ADD_FILE_PATH), {
        owner: owner,
        password: password
      }, file);
    },

    /**
     * Fetch file from distributed storage
     * @param meta {string} Unique identifier of stored file
     * @param token {string} Account authentication token
     * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
     */
    fetch: function fetch(meta, token) {
      return request.fetchFile("".concat(gwDomain).concat(FETCH_FILE_PATH), {
        meta: meta,
        token: token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};