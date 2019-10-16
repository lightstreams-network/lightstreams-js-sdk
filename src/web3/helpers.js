/**
 * User: ggarrido
 * Date: 16/10/19 9:10
 * Copyright 2019 (c) Lightstreams, Granada
 */


module.exports.isLatest = (web3) => {
  return typeof web3.version === 'string' && web3.version.indexOf('1.') === 0;
};

module.exports.isV0_20 = (web3) => {
  return typeof web3.version === 'object' && web3.version.api.indexOf('0.20') === 0;
};

const waitFor = module.exports.waitFor = (waitInSeconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

const fetchTxReceipt = module.exports.fetchTxReceipt = async (web3, txHash, expiredAt) => {
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  if (!receipt && (new Date()).getTime() < expiredAt) {
    await waitFor(0.5);
    return fetchTxReceipt(web3, txHash, expiredAt);
  }

  return receipt
};

module.exports.calculateEstimatedGas = (method, params) => {
  return new Promise((resolve, reject) => {
    method.estimateGas(params, (err, estimatedGas) => {
      if (err) {
        //   resolve(9000000);
        reject(err);
      } else {
        // @TODO Investigate issue with wrong gas estimation
        // As temporal HACK, increasing by % the estimated gas to mitigate wrong estimations
        // and define a minimum gas
        const gasOverflow = parseInt(estimatedGas * 1.2); // 20% Increment
        const gasMin = 100000;
        const gas = gasMin > gasOverflow ? gasMin : gasOverflow;
        resolve(gas);
      }
    });
  })
};
