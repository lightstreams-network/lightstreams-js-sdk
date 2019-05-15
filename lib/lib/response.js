"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * User: ggarrido
 * Date: 12/02/19 12:50
 * Copyright 2019 (c) Lightstreams, Granada
 */
var parseUnknownResponseError = function parseUnknownResponseError(response) {
  if (_typeof(response) !== 'object') {
    return response;
  }

  if (_typeof(response.body) !== 'object') {
    return new Error(response.body || message);
  }

  if (_typeof(response.body.error) === 'object') {
    return new Error(response.body.error.message);
  }

  if (typeof response.body.message === 'string' || typeof response.body.message === 'undefined') {
    return new Error(response.body.message);
  }

  return new Error("Unknown Error");
};

var newErrorGatewayResponse = function newErrorGatewayResponse(gwErr) {
  var err = new Error(gwErr.message);
  err.status = gwErr.code === 'ERROR_UNKNOWN' ? 500 : gwErr.code;
  return err;
};

module.exports.errorResponse = function (msg, code) {
  var err = new Error(msg);
  err.status = code || 500;
  return err;
};

module.exports.parseResponse = function (gwResponse) {
  if (gwResponse.status !== 200) {
    return gwResponse.json().then(function (parsedResponse) {
      debugger;

      if (_typeof(parsedResponse) === 'object' && _typeof(parsedResponse.error) === 'object') {
        throw newErrorGatewayResponse(parsedResponse.error);
      }

      throw parseUnknownResponseError(parsedResponse);
    });
  } else {
    return gwResponse.json().then(function (parsedResponse) {
      var error = parsedResponse.error,
          response = _objectWithoutProperties(parsedResponse, ["error"]);

      if (error) {
        throw newErrorGatewayResponse(error);
      }

      return response;
    });
  }
};