const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { notFoundHandler, errorHandler } = require('./lib/middleware');

const app = express();

require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

const routes = require('./routes')(process.env.GATEWAY_DOMAIN);
const router = express.Router();

_.forEach(routes, (route) => {
  router[route.method](`${route.path}`, route.call);
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

module.exports = app;
