/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */

const inherits = require('util').inherits;
const Subprovider = require('web3-provider-engine/subproviders/subprovider');
const RelayClient = require('@openzeppelin/gsn-provider/src/tabookey-gasless/RelayClient');
const { callAsJsonRpc, fixTransactionReceiptResponse } = require('@openzeppelin/gsn-provider/src/utils');
const Web3 = require('../../web3');

function GsnSubprovider(provider, opts) {
  const web3 = Web3.newEngine(provider);
  this.relayClient = new RelayClient(web3, { ...opts });
  this.jsonRpcSend = opts.jsonRpcSend ? opts.jsonRpcSend : mustProvideInConstructor('jsonRpcSend');
  this.options = opts;
  this.relayedTxs = new Set();
}

inherits(GsnSubprovider, Subprovider);

GsnSubprovider.prototype._handleGetTransactionReceipt = function(payload, cb) {
  // Check for GSN usage
  const txHash = payload.params[0];

  if (!this.relayedTxs.has(txHash)) return false;

  // Set error status if tx was rejected
  this.jsonRpcSend('eth_getTransactionReceipt', [txHash])
    .then((receipt) => {
      cb(null, fixTransactionReceiptResponse(receipt, this.options.verbose));
    })
    .catch(err => {
      cb(err, null)
    });

  return true;
};

GsnSubprovider.prototype._handleSendTransaction = function(payload, cb) {
  // Check for GSN usage
  if (!this._withGSN(payload, this.options)) return false;

  const txParams = payload.params[0];

  // Use sign key address if set
  if (!txParams.from && this.base.address) txParams.from = this.base.address;

  if (!txParams.to) {
    return cb(new Error("Cannot deploy a new contract via the GSN"), null);
  }
  if (txParams.value) {
    const strValue = txParams.value.toString();
    if (strValue !== '0' && strValue !== '0x0') {
      return cb(new Error("Cannot send funds via the GSN"), null);
    }
  }

  // Delegate to relay client
  callAsJsonRpc(
    this.relayClient.sendTransaction.bind(this.relayClient), [payload],
    payload.id, (err, res) => {
      cb(err, res && res.result);
    },
    txHash => {
      this.relayedTxs.add(txHash);
      return { result: txHash };
      // return txHash;
    }
  );

  return true;
};

GsnSubprovider.prototype._handleEstimateGas = function(payload, cb) {
  if (!this._withGSN(payload, this.options)) return false;

  const txParams = payload.params[0];

  callAsJsonRpc(
    this.relayClient.estimateGas.bind(this.relayClient), [txParams],
    payload.id, cb
  );

  return true;
};

GsnSubprovider.prototype._withGSN = function(payload, options) {
  if (typeof payload.params[0] === 'object') {
    if(typeof payload.params[0].useGSN === 'boolean') return payload.params[0].useGSN;
    else if(typeof payload.params[0].useGSN === 'function') return payload.params[0].useGSN(payload);
  }

  if (typeof options === 'object'){
    if(typeof(options.useGSN) === 'function') return options.useGSN(payload);
    if(typeof(options.useGSN) === 'boolean') return options.useGSN;
  }

  return true;
};

GsnSubprovider.prototype.handleRequest = function(payload, next, end) {
  switch ( payload.method ) {
    case 'eth_sendTransaction': {
      if (this._handleSendTransaction(payload, end)) return;
      break;
    }
    case 'eth_estimateGas': {
      if (this._handleEstimateGas(payload, end)) return;
      break;
    }
    case 'eth_getTransactionReceipt': {
      if (this._handleGetTransactionReceipt(payload, end)) return;
      break;
    }
    default: {
      next();
      return;
    }
  }

  next();
};

function mustProvideInConstructor(methodName) {
  return function(params, cb) {
    cb(new Error('ProviderEngine - HookedWalletSubprovider - Must provide "' + methodName + '" fn in constructor options'))
  }
}

module.exports = GsnSubprovider;