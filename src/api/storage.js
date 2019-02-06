/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');
const got = require('got');
const FormData = require('form-data');

const { parseGatewayError } = require('../lib/error');
const { errorHandler } = require('../lib/middleware');

const ADD_FILE_PATH = `/storage/add`;
const FETCH_FILE_PATH = `/storage/fetch`;

module.exports.addProxy = (gwDomain) => async (req, res, owner, password, file) => {
  var form = new FormData();
  form.append('owner', owner);
  form.append('password', password);
  form.append('file', file);

  const headers = {
    ...form.getHeaders(),
    ...{
      connection: req.connection,
      'content-length': req['content-length'],
      'content-type': req['content-type']
    }
  };

  const options = {
    headers: headers,
    stream: true,
    body: form
  };

  await got.stream(`${gwDomain}${ADD_FILE_PATH}`, options)
    .on('error', err => {
      errorHandler(err, req, res)
    })
    .on('uploadProgress', progress => {
      console.log(`Uploading: ${progress.transferred} KB`);
      if (progress.percent === 1) {
        console.log("Upload completed");
      }
    }).pipe(res);
};

module.exports.fetchProxy = (gwDomain) => (req, res, meta, token) => {
  const options = {
    stream: true,
    query: {
      meta,
      token
    },
  };

  got.stream(`${gwDomain}${FETCH_FILE_PATH}`, options)
    .on('error', err => {
      errorHandler(err, req, res)
    })
    .on('downloadProgress', progress => {
      console.log(`Transferring: ${progress.transferred} KB`);
      if (progress.percent === 1) {
        console.log("Transfer completed");
      }
    })
    .pipe(res);
};