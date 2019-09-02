"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    }, options)).then(parseResponse)["catch"](function (err) {
      if (err.message === 'Failed to fetch') {
        throw new Error("Request failed: ".concat(url));
      }

      throw err;
    });
  };

  var post = function post(url, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return fetch(url, _objectSpread({}, defaultOptions, {}, options, {
      body: JSON.stringify(data),
      method: 'POST'
    })).then(parseResponse)["catch"](function (err) {
      if (err.message === 'Failed to fetch') {
        throw new Error("Request failed: ".concat(url));
      }

      throw err;
    });
  };

  var postFile = function postFile(url, data, file) {
    var FormData = require('form-data');

    var form = new FormData();
    form.append('file', file);
    Object.keys(data).forEach(function (dataKey) {
      form.append(dataKey, data[dataKey]);
    }); // const headers = (typeof form.getHeaders === 'function')
    //   ? form.getHeaders()
    //   : {
    //     'Content-Type': 'multipart/form-data'
    //   };

    return fetch(url, {
      body: form,
      method: 'POST'
    }).then(parseResponse);
  };

  var fetchFile = function fetchFile(url, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return fetch(url + queryParams(data), _objectSpread({}, defaultOptions, {}, options, {
      method: 'GET'
    })).then(function (res) {
      if (options['stream']) {
        return res;
      }

      if (res.status === 200) {
        return parseResponse(res);
      }

      if (res.headers.get('content-type').indexOf('json') !== -1) {
        return parseResponse(res);
      }

      return {
        status: res.status,
        message: res.statusText
      };
    });
  };

  return {
    get: get,
    post: post,
    postFile: postFile,
    fetchFile: fetchFile
  };
}();