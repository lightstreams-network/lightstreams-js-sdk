/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { extractRequestAttrs } = require('../lib/request');
const { jsonResponse, badInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const signUp = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['password']);
    if (!attrs.password) {
      next(badInputResponse());
      return;
    }

    try {
      const { account } = await gwApi.signUp(attrs.password);
      res.send(jsonResponse({ account }));
    } catch ( err ) {
      next(err);
    }
  };

  const signIn = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['account', 'password']);
    if (!attrs.password || !attrs.account) {
      next(badInputResponse());
      return;
    }

    try {
      const { token } = await gwApi.signIn(attrs.account, attrs.password);
      res.send(jsonResponse({ token }));
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
