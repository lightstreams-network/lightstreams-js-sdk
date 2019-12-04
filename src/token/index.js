/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 27/11/19 15:15
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

module.exports.generateAuthToken = async (web3, { address, tokenBlocksLifespan }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentBlock = await Web3Wrapper.getBlockNumber(web3);
      const expirationBlock = currentBlock + tokenBlocksLifespan;

      const claims = {
        blockchain: "ETH",
        eth_address: address,
        iat: currentBlock,
        eat: expirationBlock
      };

      const marshalledClaims = JSON.stringify(claims);

      Web3Wrapper.keystore.sign(web3, { msg: marshalledClaims, address }, (err, signedMsg) => {
        let marshalledClaimsHexBuffer = new Buffer(marshalledClaims, 'ascii');
        let encodedClaimsBase64 = marshalledClaimsHexBuffer.toString('base64');

        let sigHexBuffer = new Buffer(Web3Wrapper.utils.stripHexPrefix(signedMsg), 'hex');
        let encodedSigBase64 = sigHexBuffer.toString('base64');

        const token = encodedClaimsBase64 + "." + encodedSigBase64;

        resolve(token);
      });
    } catch (e) {
      reject(e);
    }
  });
};
