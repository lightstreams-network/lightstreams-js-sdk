/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');
const got = require('got');
const FormData = require('form-data');

const ADD_FILE_PATH = `/storage/add`;
const FETCH_FILE_PATH = `/storage/fetch`;

const { defaultOptions } = require('../lib/gateway');

module.exports = (gwDomain) => ({
  /**
   * Uploaded new file into distributed storage
   * @param owner Address of the owner of the file
   * @param password The password that unlocks the owner
   * @param file File to add
   * @returns {StreamResponse<{ meta, acl }>}
   * `meta` refers to the unique identifier for file uploaded into distributed storage
   * `acl` refers to the acl smart contract address
   */
  addProxy: async (owner, password, file) => {
    var form = new FormData();
    form.append('owner', owner);
    form.append('password', password);
    form.append('file', file);

    const options = {
      ...defaultOptions,
      headers: form.getHeaders(),
      body: form
    };

    return got.post(`${gwDomain}${ADD_FILE_PATH}`, options);
  },
  /**
   * Fetch file from distributed storage
   * @param meta Unique identifier of stored file
   * @param token Account authentication token
   * @returns {StreamResponse<**CONTENT_FILE**>}
   */
  fetchProxy: async (meta, token) => {
    const options = {
      ...defaultOptions,
      stream: true,
      query: {
        meta,
        token
      },
    };

    return got.get(`${gwDomain}${FETCH_FILE_PATH}`, options);
  }
});

