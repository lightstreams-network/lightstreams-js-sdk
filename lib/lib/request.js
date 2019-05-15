"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * User: ggarrido
 * Date: 12/02/19 12:50
 * Copyright 2019 (c) Lightstreams, Granada
 */
var _require = require('./response'),
    parseResponse = _require.parseResponse;

function queryParams(params) {
  var paramKeys = Object.keys(params);

  if (!paramKeys.length) {
    return '';
  }

  return '?' + Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  }).join('&');
}

module.exports = function () {
  var fetch = require('node-fetch');

  var defaultOptions = {
    json: true,
    throwHttpErrors: false,
    followRedirect: false
  };

  var get = function get(url, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return fetch(url + queryParams(data), _objectSpread({}, defaultOptions, {
      method: 'GET'
    }, options)).then(parseResponse);
  };

  var post = function post(url, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return fetch(url, _objectSpread({}, defaultOptions, options, {
      body: JSON.stringify(data),
      method: 'POST'
    })).then(parseResponse);
  };

  var postFile = function postFile(url, data, file) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var FormData = require('form-data');

    var form = new FormData();
    form.append('file', file);
    Object.keys(data).forEach(function (dataKey) {
      form.append(dataKey, data[dataKey]);
    });
    return fetch(url, _objectSpread({}, defaultOptions, {
      body: form,
      headers: form.getHeaders(),
      method: 'POST'
    }, options)).then(parseResponse);
  };

  var fetchFile = function fetchFile(url, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return fetch(url + queryParams(data), _objectSpread({}, defaultOptions, options, {
      method: 'GET'
    })).then(function (res) {
      if (res.status !== 200) {
        return parseResponse(res);
      } else {
        return res.body;
      }
    });
  };

  return {
    get: get,
    post: post,
    postFile: postFile,
    fetchFile: fetchFile
  };
}();