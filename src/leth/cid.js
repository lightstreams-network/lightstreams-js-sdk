/**
 * User: ggarrido
 * Date: 25/02/20 12:53
 * Copyright 2019 (c) Lightstreams, Granada
 */


const CID = require('cids');
const Web3Wrapper = require('../web3');

const cidPrefix = 'Qm';
const cidLength = 46;

function convertHexToCid(hexValue) {
  const arrayBuffer = [...[18, 32], ...Web3Wrapper.utils.hexToBytes(hexValue)];
  const cidObj = new CID(Web3Wrapper.utils.toBuffer(arrayBuffer));
  return cidObj.toString();
}

function convertCidToBytes32(cid) {
  if (cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error('Invalid cid value');
  }
  const cidObj = new CID(cid);
  return cidObj.multihash.slice(2).toJSON().data;
}

function validateCid(cid) {
  if (typeof cid !== 'string' || cid.length !== cidLength || cid.indexOf(cidPrefix) !== 0) {
    throw new Error(`Invalid CID value: ${cid}`);
  }

  new CID(cid);
}

function isValidCid(cid) {
  try{
    validateCid(cid);
    return true;
  } catch(err) {
    return false;
  }
}

module.exports.convertHexToCid = convertHexToCid;
module.exports.convertCidToBytes32 = convertCidToBytes32;
module.exports.validateCid = validateCid;
module.exports.isValidCid = isValidCid;