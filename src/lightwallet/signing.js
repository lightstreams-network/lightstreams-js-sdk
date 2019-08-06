/**
 * User: ggarrido
 * Date: 6/08/19 12:01
 * Copyright 2019 (c) Lightstreams, Granada
 */


var Util = require('ethereumjs-util');
const { signing, txutils } = require('eth-lightwallet');

module.exports = ({
  signSendValueTx: async (web3, keystore, {from, password, to, value}) => {
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(from);

    const txOptions = {
      gasPrice: parseInt(gasPrice),
      gasLimit: 21000,
      value: parseInt(value),
      nonce: parseInt(nonce),
      to: Util.stripHexPrefix(to)
    };

    return await new Promise((resolve, reject) => {
      var rawTx = txutils.valueTx(txOptions);
      var signingAddress = Util.stripHexPrefix(from);

      keystore.keyFromPassword(password, function(err, pwDerivedKey) {
        if (err) {
          reject(err);
        }

        var signedTx = signing.signTx(keystore, pwDerivedKey, rawTx, signingAddress);
        var rawSignedTx = Util.addHexPrefix(signedTx);
        resolve(rawSignedTx);
      });
    });
  }
});