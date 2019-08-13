/**
 * User: ggarrido
 * Date: 6/08/19 12:01
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Util = require('ethereumjs-util');
const { signing, txutils } = require('eth-lightwallet');

module.exports = ({
  signDeployContractTx: async (web3, keystore, pwDerivedKey, { from, bytecode }) => {
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);
    const gasLimit = await web3.eth.estimateGas({ data: bytecode });
    const sendingAddr = Util.stripHexPrefix(from);

    txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(gasLimit),
      value: 0,
      nonce: parseInt(nonce),
      data: bytecode
    };

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