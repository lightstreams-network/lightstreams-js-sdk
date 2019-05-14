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
      stream: true,
      throwHttpErrors: false,
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
      stream: true,
      throwHttpErrors: false,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
      query: {
        meta,
        token
      },
    };

    return got.get(`${gwDomain}${FETCH_FILE_PATH}`, options);
  },

  /**
   * Fetch file from distributed storage
   * @param meta Unique identifier of stored file
   * @param token Account authentication token
   * @param options Got lib options
   */
  fetch: async (meta, token, options = {}) => {
    const defaultOptions = {
      throwHttpErrors: false,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      },
    };

    return got.get(`${gwDomain}${FETCH_FILE_PATH}`, {
      ...defaultOptions,
      ...options,
      query: {
        meta,
        token
      },
    });
  },

  /**
   * Uploaded new file into distributed storage
   * @param owner Address of the owner of the file
   * @param password The password that unlocks the owner
   * @param file File to add
   * @param options Got lib options
   */
  add: async (owner, password, file, options = {}) => {
    var form = new FormData();
    form.append('owner', owner);
    form.append('password', password);
    form.append('file', file);

    const defaultOptions = {
      throwHttpErrors: false,
      headers: form.getHeaders(),
      body: form
    };

    return got.post(`${gwDomain}${ADD_FILE_PATH}`, {
      ...defaultOptions,
      ...options,
    });
  },
});

