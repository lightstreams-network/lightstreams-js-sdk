/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { extractRequestAttrs } = require('../lib/request');
const { jsonResponse, badInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const addFile = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['owner', 'password']);

    if (!attrs.owner || !attrs.password) {
      next(badInputResponse());
      return;
    }

    if(!req.files.file) {
      next(badInputResponse());
      return;
    }

    try {
      await gwApi.addProxy(req, res, attrs.owner, attrs.password, req.files.file);
    } catch ( err ) {
      next(err);
    }
  };

  const fetchFile = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['meta', 'token']);
    if (!attrs.meta || !attrs.token) {
      next(badInputResponse());
      return;
    }

    try {
      gwApi.fetchProxy(req, res, attrs.meta, attrs.token);
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'add',
      call: addFile,
      method: 'post'
    },
    {
      path: 'fetch',
      call: fetchFile,
      method: 'get'
    },
  ];
};
