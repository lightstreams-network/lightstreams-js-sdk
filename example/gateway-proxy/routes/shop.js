/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const create = async (req, res, next) => {
    const query = ['from', 'password'];
    try {
      validateRequestAttrs(req, query);
    } catch (err) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { shop } = await gwApi.shop.create(attrs.from, attrs.password);
      res.send(JsonResponse({ shop }));
    } catch ( err ) {
      next(err);
    }
  };

  const sell = async (req, res, next) => {
    const query = ['shop', 'from', 'password', 'acl', 'price_wei'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { success } = await gwApi.shop.sell(attrs.shop, attrs.from, attrs.password, attrs.acl, attrs.price_wei);
      res.send(JsonResponse({ success }));
    } catch ( err ) {
      next(err);
    }
  };

  const buy = async (req, res, next) => {
    const query = ['shop', 'from', 'password', 'acl'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { success } = await gwApi.shop.buy(attrs.shop, attrs.from, attrs.password, attrs.acl);
      res.send(JsonResponse({ success }));
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'create',
      call: create,
      method: 'post'
    },
    {
      path: 'sell',
      call: sell,
      method: 'post'
    },
    {
      path: 'buy',
      call: buy,
      method: 'post'
    }
  ];
};
