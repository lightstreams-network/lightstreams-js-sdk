"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * User: ggarrido
 * Date: 25/02/20 12:53
 * Copyright 2019 (c) Lightstreams, Granada
 */
var CID = require('cids');

var Web3Wrapper = require('../web3');

var cidPrefix = 'Qm';
var cidLength = 46;

function convertHexToCid(hexValue) {
  var arrayBuffer = [18, 32].concat(_toConsumableArray(Web3Wrapper.utils.hexToBytes(hexValue)));
  var cidObj = new CID(Web3Wrapper.utils.toBuffer(arrayBuffer));
  return cidObj.toString();
}

function convertCidToBytes32(cid) {
  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }

  var cidObj = new CID(cid);
  return cidObj.multihash.slice(2).toJSON().data;
}

function validateCid(cid) {
  if (typeof cid !== 'string' || cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error("Invalid CID value: ".concat(cid));
  }

  new CID(cid);
}

function isValidCid(cid) {
  try {
    validateCid(cid);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports.convertHexToCid = convertHexToCid;
module.exports.convertCidToBytes32 = convertCidToBytes32;
module.exports.validateCid = validateCid;
module.exports.isValidCid = isValidCid;