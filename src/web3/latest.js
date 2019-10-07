/**
 * User: ggarrido
 * Date: 5/08/19 15:45
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Web3 = require('web3');
const net = require('net');

// Increasing estimated gas to prevent wrong estimations
const gasThreshold = 200000;

const defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000,
};

// const logParser = function(web3, { logs, abi }) {
//   return logs.map(function(log) {
//     // return decoders.find(function(decoder) {
//     //   return (decoder.signature() == log.topics[0].replace("0x", ""));
//     // }).decode(log);
//     return web3.eth.abi.decodeLog([{
//       type: 'string',
//       name: 'myString'
//     }, {
//       type: 'uint256',
//       name: 'myNumber',
//       indexed: true
//     }, {
//       type: 'uint8',
//       name: 'mySmallNumber',
//       indexed: true
//     }], log.data, log.topics[0].replace("0x", ""));
//   })
// };

const waitFor = (waitInSeconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

const fetchTxReceipt = async (web3, txHash, expiredAt) => {
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  if (!receipt && (new Date()).getTime() < expiredAt) {
    await waitFor(0.5);
    return fetchTxReceipt(web3, txHash, expiredAt);
  }

  return receipt
};

const getTxReceipt = (web3, { txHash, timeoutInSec }) => {
  return new Promise((resolve, reject) => {
    fetchTxReceipt(web3, txHash, (new Date()).getTime() + (timeoutInSec || 15) * 1000).then(receipt => {
      if (!receipt) {
        reject(new Error(`Cannot fetch tx receipt ${txHash}`))
      }
      resolve(receipt);
    }).catch(reject);
  });
};

const handleReceipt = (web3, { txHash, resolve, reject }) => {
  getTxReceipt(web3, { txHash }).then(txReceipt => {
    if (!txReceipt.status) {
      reject(new Error(`Failed tx ${txHash}`))
    }
    resolve(txReceipt);
  });
};

const calculateEstimatedGas = (method, params) => {
  return new Promise((resolve, reject) => {
    method.estimateGas(params, (err, estimatedGas) => {
      if (err) reject(err);
      // if (err) {
      //   debugger;
      //   resolve(9000000);
      // }
      else {
        const gas = estimatedGas + gasThreshold;
        resolve(gas);
      }
    });
  })
};

module.exports.initialize = async (provider, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = new Web3(provider || defaultCfg.provider, net, {
        defaultGasPrice: options.gasPrice || defaultCfg.gasPrice,
      });

      resolve(web3);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.networkVersion = (web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.net.getId((err, netId) => {
      if (err) reject(err);
      resolve(netId);
    })
  })
};

module.exports.getTxReceipt = getTxReceipt;

module.exports.getBalance = (web3, { address }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balance = await web3.eth.getBalance(address);
      resolve(balance);
    } catch ( err ) {
      reject(err)
    }
  })
};

module.exports.sendRawTransaction = (web3, rawSignedTx) => {
  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(rawSignedTx, (err, txHash) => {
      if (err) {
        reject(err);
      }
      handleReceipt(web3, {txHash, resolve, reject});
    });
  });
};

module.exports.sendTransaction = (web3, { from, to, valueInPht }) => {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(valueInPht, "ether"),
    }).on('transactionHash', (txHash) => {
      handleReceipt(web3, {txHash, resolve, reject});
    }).on('error', reject);
  });
};

module.exports.contractCall = (web3, contractAddress, { abi, from, method, params }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(abi, contractAddress);
      if (typeof contract.methods[method] !== 'function') {
        throw new Error(`Method ${method} is not available`);
      }
      const result = await contract.methods[method](...params).call({ from });
      resolve(result);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.contractSendTx = (web3, contractAddress, { abi, from, method, params, value }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(abi, contractAddress);
      if(typeof contract.methods[method] !== 'function') {
        throw new Error(`Method ${method} is not available`);
      }


      const sendTx = contract.methods[method](...params);
      const estimatedGas = await calculateEstimatedGas(sendTx, { from, value });

      sendTx.send({
        from,
        value,
        gas: estimatedGas
      }).on('transactionHash', (txHash) => {
        console.log(`Tx executed ${txHash}`)
      }).on('receipt', (txReceipt) => {
        if (!txReceipt.status) {
          reject(new Error(`Failed tx ${txReceipt.hash}`))
        }
        resolve(txReceipt);
      }).on('error', reject);

    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.deployContract = (web3, { from, abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(abi);
      const contractDeploy = contract.deploy({ data: bytecode, arguments: params || [] });
      const estimatedGas = await calculateEstimatedGas(contractDeploy, { from });

      contractDeploy.send({
        from,
        gas: estimatedGas
      }).on('transactionHash', (txHash) => {
        console.log(`Tx executed ${txHash}`)
      }).on('receipt', (txReceipt) => {
        if (!txReceipt.status) {
          reject(new Error(`Failed tx ${txReceipt.hash}`))
        }
        resolve(txReceipt);
      }).on('error', reject);

    } catch(err) {
      reject(err);
    }
  });
};
