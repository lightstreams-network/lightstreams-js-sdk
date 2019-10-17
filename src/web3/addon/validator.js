
/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 17/10/19 10:45
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { isAddress } = require('./utils');

module.exports.validateAddress = (argName, argValue) => {
  if (!isAddress(argValue)) {
    throw new Error(`Invalid argument "${argName}": "${argValue}". Expected a valid eth address`);
  }
};
