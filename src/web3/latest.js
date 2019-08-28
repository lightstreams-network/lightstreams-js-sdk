/**
 * User: ggarrido
 * Date: 5/08/19 15:45
 * Copyright 2019 (c) Lightstreams, Granada
 */


const Web3 = require('web3');
const net = require('net');

const defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000,
};

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

module.exports.unlockAccount = (web3, address, password, timeInMilliseconds = 1000) => {
  return new Promise((resolve, reject) => {
    debugger;
    web3.eth.personal.unlockAccount(address, password, timeInMilliseconds)
      .then(resolve)
      .catch(reject)
  });
};

module.exports.getTxReceipt = (web3, txHash, timeoutInSec = 30) => {
  return new Promise((resolve, reject) => {
    fetchTxReceipt(web3, txHash, (new Date()).getTime() + timeoutInSec * 1000).then(receipt => {
      if (!receipt) {
        reject()
      }
      resolve(receipt);
    })
  });
};

module.exports.getBalance = (web3, address) => {
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
    web3.eth.sendSignedTransaction(rawSignedTx, (err, hash) => {
      if (err) {
        reject(err);
      }

      resolve(hash);
    });
  });
};

module.exports.sendTransaction = (web3, { to, value }) => {
  throw new Error('Missing implementation');
};

module.exports.contractCall = (web3, contractAddress, { abi, from, method, params }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(abi, contractAddress);
      const result = await contract.methods[method](...params).call({
        from: address
      });
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
      const sendTx = contract.methods[method](...params);
      debugger;
      const estimatedGas = await (new Promise((resolve, reject) => {
        sendTx.estimateGas({ from }, (err, gas) => {
          // if (err) reject(err);
          if (err) resolve(9000000);
          else resolve(gas);
        });
      }));
      contract.methods[method](...params).send({
        from,
        gas: estimatedGas,
        value: value || 0
      }).on('transactionHash', resolve)
        .on('error', reject);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.deployContract = (web3, { from, abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {
    const contract = new web3.eth.Contract(abi);
    const contractDeploy = contract.deploy({ data: bytecode, arguments: params || [] });
    const estimatedGas = await( new Promise((resolve, reject) => {
      contractDeploy.estimateGas((err, gas) => {
          if (err) reject(err);
          else resolve(gas);
        });
    }));

    contractDeploy.send({ from, gas: estimatedGas })
      .on('error', reject)
      .on('transactionHash', resolve)
  });
};
