/**
 * User: ggarrido
 * Date: 4/02/19 18:18
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { notFoundResponse, jsonResponse } = require('./response');

module.exports.notFoundHandler = (req, res, next) => {
  next(notFoundResponse());
};

module.exports.errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const status = err.status || 500;

  res.status(status);

  if (/json/.test(req.get('accept'))) {
    res.setHeader('Content-Type', 'application/json');
    res.json(jsonResponse(err.stack.split('\n'), err))
  } else {
    res.render('error');
  }
};

