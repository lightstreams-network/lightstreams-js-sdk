/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const signUp = async (req, res, next) => {
    const query = ['password'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { account } = await gwApi.user.signUp(attrs.password);
      res.send(JsonResponse({ account }));
    } catch ( err ) {
      next(err);
    }
  };

  const signIn = async (req, res, next) => {
    const query = ['password', 'account'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { token } = await gwApi.user.signIn(attrs.account, attrs.password);
      res.send(JsonResponse({ token }));
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'signup',
      call: signUp,
      method: 'post'
    },
    {
      path: 'signin',
      call: signIn,
      method: 'post'
    }
  ];
};
