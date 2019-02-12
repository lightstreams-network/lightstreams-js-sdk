/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const balance = async (req, res, next) => {
    const query = ['account', 'erc20_address'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { balance } = await gwApi.erc20.balance(attrs.erc20_address, attrs.account);
      res.send(JsonResponse({ balance }));
    } catch ( err ) {
      next(err);
    }
  };

  const transfer = async (req, res, next) => {
    const query = ['erc20_address', 'from', 'password', 'to', 'amount'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { balance } = await gwApi.erc20.transfer(attrs.erc20_address,
        attrs.from,
        attrs.password,
        attrs.to,
        attrs.amount
      );
      res.send(JsonResponse({ balance }));
    } catch ( err ) {
      next(err);
    }
  };

  const purchase = async (req, res, next) => {
    const query = ['erc20_address', 'account', 'password', 'amount_wei'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { tokens } = await gwApi.erc20.purchase(attrs.erc20_address,
        attrs.account,
        attrs.password,
        attrs.amount_wei
      );
      res.send(JsonResponse({ tokens }));
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'balance',
      call: balance,
      method: 'get'
    },
    {
      path: 'transfer',
      call: transfer,
      method: 'post'
    },
    {
      path: 'purchase',
      call: purchase,
      method: 'post'
    }
  ];
};
