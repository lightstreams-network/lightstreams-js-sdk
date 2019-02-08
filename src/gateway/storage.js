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
   *
   * @param owner
   * @param password
   * @param file
   * @returns {Promise<*>}
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
   *
   * @param gwDomain
   * @returns {function(*, *): *}
   */
  fetchProxy: (gwDomain) => async (meta, token) => {
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

