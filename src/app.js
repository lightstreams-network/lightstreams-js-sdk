const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const os = require("os");

const { notFoundHandler, errorHandler } = require('./lib/middleware');

const app = express();

require('http').Server(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// parse data with connect-multiparty.
app.use(formData.parse({
  uploadDir: os.tmpdir(),
  autoClean: true
}));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());

const router = express.Router();
const routes = require('./routes')(process.env.GATEWAY_DOMAIN);

_.forEach(routes, (route) => {
  router[route.method](`${route.path}`, route.call);
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

module.exports = app;
