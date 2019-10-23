"use strict";

/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 17/10/19 10:45
 * Copyright 2019 (c) Lightstreams, Granada
 */
var _require = require('./utils'),
    isAddress = _require.isAddress,
    isBN = _require.isBN;

module.exports.validateAddress = function (argName, argValue) {
  if (!isAddress(argValue)) {
    throw new Error("Invalid argument \"".concat(argName, "\": \"").concat(argValue, "\". Expected a valid eth address"));
  }
};

module.exports.validateWeiBn = function (argName, argValue) {
  if (!isBN(argValue)) {
    throw new Error("Invalid \"".concat(argName, "\" value \"").concat(argValue, "\". Expected valid Wei amount represented as a BN"));
  }
};