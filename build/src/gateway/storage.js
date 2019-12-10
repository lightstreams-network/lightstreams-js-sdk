"use strict";

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var ADD_FILE_PATH = "/storage/add";
var UPDATE_FILE_PATH = "/storage/update";
var ADD_FILE_WITH_ACL_PATH = "/storage/add-with-acl";
var FETCH_FILE_PATH = "/storage/fetch";
var META_PATH = "/storage/meta";

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
     * Uploaded new file into distributed storage
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