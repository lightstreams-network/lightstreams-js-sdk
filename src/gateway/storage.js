/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const ADD_FILE_PATH = `/storage/add`;
const UPDATE_FILE_PATH = `/storage/update`;
const ADD_FILE_WITH_ACL_PATH = `/storage/add-with-acl`;
const FETCH_FILE_PATH = `/storage/fetch`;
const META_PATH = `/storage/meta`;

const request = require('../http/request');

module.exports = (gwDomain) => ({
  /**
   * Uploaded new file into distributed storage
   * @param owner {string} Address of the owner of the file
   * @param password {string} The password that unlocks the owner
   * @param file {ReadableStream|File} File to add
   * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
   */
  add: (owner, password, file) => {
    if (typeof File !== 'undefined' && file instanceof File) {
      const reader = new FileReader();
      const fileBlob = file.slice(0, file.size);
      reader.readAsBinaryString(fileBlob)
    }
    return request.postFile(`${gwDomain}${ADD_FILE_PATH}`, {
      owner,
      password,
    }, file);
  },

  /**
   * Uploaded new file into distributed storage
   * @param owner {string} Address of the owner of the file
   * @param acl {string} Address to acl contract
   * @param file {ReadableStream|File} File to add
   * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
   */
  addWithAcl: (owner, acl, file) => {
    if (typeof File !== 'undefined' && file instanceof File) {
      const reader = new FileReader();
      const fileBlob = file.slice(0, file.size);
      reader.readAsBinaryString(fileBlob)
    }
    return request.postFile(`${gwDomain}${ADD_FILE_WITH_ACL_PATH}`, {
      owner,
      acl,
    }, file);
  },

  /**
   * Update distributed file content and link it to previous version
   * @param owner {string} Address of the owner of the file
   * @param meta {string} Unique identifier of stored file
   * @param file {ReadableStream|File} File to add
   * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
   */
  update: (owner, meta, file) => {
    if (typeof File !== 'undefined' && file instanceof File) {
      const reader = new FileReader();
      const fileBlob = file.slice(0, file.size);
      reader.readAsBinaryString(fileBlob)
    }
    return request.postFile(`${gwDomain}${UPDATE_FILE_PATH}`, {
      meta,
      owner,
    }, file);
  },

  /**
   * Fetch file from distributed storage
   * @param meta {string} Unique identifier of stored file
   * @param token {string} Account authentication token
   * @param stream {boolean} Response to be streamed or not
   * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
   */
  fetch: (meta, token, stream) => {
    return request.fetchFile(`${gwDomain}${FETCH_FILE_PATH}`, {
      meta,
      token
    }, {
      stream,
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
  meta: (meta) => {
    return request.get(`${gwDomain}${META_PATH}`, {
      meta
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
});

