/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { extractRequestAttrs } = require('../lib/request');
const { jsonResponse, badInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const getBalance = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['account']);
    if (!attrs.account) {
      next(badInputResponse());
      return;
    }

    try {
      const { balance } = await gwApi.balance(attrs.account);
      res.send(jsonResponse({ balance }));
    } catch ( err ) {
      next(err);
    }
  };

  const transfer = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['from', 'password', 'to', 'amount_wei']);
    if (!attrs.from || !attrs.password || !attrs.to || !attrs.amount_wei) {
      next(badInputResponse());
      return;
    }

    try {
      const { balance } = await gwApi.transfer(attrs.from, attrs.password, attrs.to, attrs.amount_wei);
      res.send(jsonResponse({ balance }));
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
