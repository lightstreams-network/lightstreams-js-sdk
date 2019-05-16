/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const addFile = async (req, res, next) => {
    const query = ['owner', 'password', 'file'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { meta, acl } = await gwApi.storage.add(attrs.owner, attrs.password, attrs.file);
      res.send(JsonResponse({ meta, acl }));
    } catch ( err ) {
      next(err);
    }
  };

  const fetchFile = async (req, res, next) => {
    const query = ['meta', 'token'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const reqStream = await gwApi.storage.fetch(attrs.meta, attrs.token, true);
      reqStream.body.pipe(res);
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
