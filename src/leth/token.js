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

      Web3Wrapper.keystore.signAuthToken(web3, { msg: marshalledClaims, address }, (err, signedMsg) => {
        const marshalledClaimsHexBuffer = new Buffer(marshalledClaims, 'ascii');
        const encodedClaimsBase64 = marshalledClaimsHexBuffer.toString('base64');
        const encodedClaimsBase64URLSafe = encodedClaimsBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

        const sigHexBuffer = new Buffer(Web3Wrapper.utils.stripHexPrefix(signedMsg), 'hex');
        const encodedSigBase64 = sigHexBuffer.toString('base64');
        const encodedSigBase64URLSafe = encodedSigBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

        const token = encodedClaimsBase64URLSafe + "." + encodedSigBase64URLSafe;

        resolve(token);
      });
    } catch (e) {
      reject(e);
    }
  });
};
