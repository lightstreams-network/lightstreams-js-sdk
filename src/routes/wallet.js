/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const getBalance = async (req, res, next) => {
    const query = ['account'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { balance } = await gwApi.wallet.balance(attrs.account);
      res.send(JsonResponse({ balance }));
    } catch ( err ) {
      next(err);
    }
  };

  const transfer = async (req, res, next) => {
    const query = ['from', 'password', 'to', 'amount_wei'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { balance } = await gwApi.wallet.transfer(attrs.from, attrs.password, attrs.to, attrs.amount_wei);
      res.send(JsonResponse({ balance }));
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'balance',
      call: getBalance,
      method: 'get'
    },
    {
      path: 'transfer',
      call: transfer,
      method: 'post'
    }
  ];
};
