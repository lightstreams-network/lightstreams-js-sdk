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

module.exports.addProxy = (gwDomain) => (owner, password, file) => {
  var form = new FormData();
  form.append('owner', owner);
  form.append('password', password);
  form.append('file', file);

  const options = {
    headers: form.getHeaders(),
    stream: true,
    throwHttpErrors: false,
    body: form
  };

  return got.post(`${gwDomain}${ADD_FILE_PATH}`, options);
};

module.exports.fetchProxy = (gwDomain) => (meta, token) => {
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
};