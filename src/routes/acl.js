/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const grant = async (req, res, next) => {
    const query = ['acl', 'owner', 'password', 'to', 'permission'];
    try {
      validateRequestAttrs(req, query);
    } catch (err) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { is_granted } = await gwApi.acl.grant(attrs.acl, attrs.owner, attrs.password, attrs.to, attrs.permission);
      res.send(JsonResponse({ is_granted }));
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'grant',
      call: grant,
      method: 'post'
    }
  ];
};
