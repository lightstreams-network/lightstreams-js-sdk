/**
 * User: ggarrido
 * Date: 6/08/19 12:01
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Util = require('ethereumjs-util');
const { signing, txutils } = require('eth-lightwallet');

module.exports = ({
  signDeployContractTx: async (web3, keystore, pwDerivedKey, { from, bytecode }) => {
    debugger;
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);
    const gasLimit = await web3.eth.estimateGas({ data: bytecode });
    txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(gasLimit),
      value: 0,
      nonce: parseInt(nonce),
      data: bytecode
    };

    const sendingAddr = Util.stripHexPrefix(from);
    const contractData = txutils.createContractTx(sendingAddr, txOptions);

    const signedTx = signing.signTx(keystore, pwDerivedKey, contractData.tx, sendingAddr);
    return Util.addHexPrefix(signedTx);
  },
  signSendValueTx: async (web3, keystore, pwDerivedKey, { from, to, value }) => {
    debugger;
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);

    const txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: 21000,
      value: parseInt(value),
      nonce: parseInt(nonce),
      to: Util.stripHexPrefix(to)
    };

    const rawTx = txutils.valueTx(txOptions);
    const signingAddress = Util.stripHexPrefix(from);

    const signedTx = signing.signTx(keystore, pwDerivedKey, rawTx, signingAddress);
    return Util.addHexPrefix(signedTx);
  }
});