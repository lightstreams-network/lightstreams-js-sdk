/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const ADD_FILE_PATH = `/storage/add`;
const FETCH_FILE_PATH = `/storage/fetch`;

const request = require('../lib/request');

module.exports = (gwDomain) => ({
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
  add: (owner, password, file, stream = false) => {
    const options = stream
      ? {stream: true, throwHttpErrors: false }
      : {stream: false, throwHttpErrors: true };
    return request.postFile(`${gwDomain}${ADD_FILE_PATH}`, {
      owner,
      password,
    }, file, options);
  },

  /**
   * Fetch file from distributed storage
   * @param meta Unique identifier of stored file
   * @param token Account authentication token
   * @param stream stream file up
   * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
   */
  fetch: (meta, token, stream = false) => {
    const options = stream
      ? { stream: true, throwHttpErrors: false }
      : { stream: false, throwHttpErrors: true };
    return request.fetchFile(`${gwDomain}${FETCH_FILE_PATH}`, {
      meta,
      token
    }, {
      ...options,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
});

