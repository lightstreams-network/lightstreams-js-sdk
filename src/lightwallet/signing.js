/**
 * User: ggarrido
 * Date: 6/08/19 12:01
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Util = require('ethereumjs-util');
const { signing, txutils } = require('eth-lightwallet');

var encodeConstructorParams = function(web3, abi, params) {
  return abi.filter(function(json) {
    return json.type === 'constructor' && json.inputs.length === params.length;
  }).map(function(json) {
    return json.inputs.map(function(input) {
      return input.type;
    });
  }).map(function(types) {
    return web3.eth.abi.encodeParameters(types, params).slice(2); // Remove initial 0x
  })[0] || '';
};

module.exports = ({
  signDeployContractTx: async (web3, keystore, pwDerivedKey, { from, bytecode, abi, params }) => {
    const encodeParams = encodeConstructorParams(web3, abi, params);
    const gasLimit = await web3.eth.estimateGas({ data: bytecode + encodeParams, from });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);

    txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(gasLimit),
      value: 0,
      nonce: parseInt(nonce),
      data: bytecode + encodeParams
    };

    const sendingAddr = Util.stripHexPrefix(from);
    const contractData = txutils.createContractTx(sendingAddr, txOptions);

    const signedTx = signing.signTx(keystore, pwDerivedKey, contractData.tx, sendingAddr);
    return Util.addHexPrefix(signedTx);
  },
  signContractMethodTx: async (web3, keystore, pwDerivedKey, { from, value, method, params, abi, address }) => {
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);
    const sendingAddr = Util.stripHexPrefix(from);
    const contractInstance = new web3.eth.Contract(abi, address);
    const gasLimit = await contractInstance.methods[method](...params).estimateGas();
    // @TODO: Sanity checks over ABI against params+method

    txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(gasLimit),
      value: parseInt(value || 0),
      nonce: parseInt(nonce),
      to: address
    };

    var setValueTx = txutils.functionTx(abi, method, params, txOptions);
    var signedTx = signing.signTx(keystore, pwDerivedKey, setValueTx, sendingAddr);
    return Util.addHexPrefix(signedTx);
  },
  signSendValueTx: async (web3, keystore, pwDerivedKey, { from, to, value }) => {
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);
    const signingAddress = Util.stripHexPrefix(from);

    const txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: 21000,
      value: parseInt(value),
      nonce: parseInt(nonce),
      to: Util.stripHexPrefix(to)
    };

    const rawTx = txutils.valueTx(txOptions);
    const signedTx = signing.signTx(keystore, pwDerivedKey, rawTx, signingAddress);
    return Util.addHexPrefix(signedTx);
  }
});