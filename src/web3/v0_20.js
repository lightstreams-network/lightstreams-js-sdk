/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */

// Increasing estimated gas to prevent wrong estimations
const estimatedGasThreshold = 1000;

const fetchGasPrice = (web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.getGasPrice((err, result) => {
      if (err) reject(err);
      resolve(result.toNumber())
    });
  })
};

const calculateEstimateGas = (web3, { data, to }) => {
  return new Promise((resolve, reject) => {
    web3.eth.estimateGas({ data, to }, (err, result) => {
      if (err) reject(err);
      resolve(result)
    });
  });
};

const waitFor = (waitInSeconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

const fetchTxReceipt = (web3, txHash, expiredAt) => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(txHash, async (err, receipt) => {
      if (err) {
        reject(err);
        return;
      }

      if (receipt) {
        resolve(receipt);
        return;
      }

      if ((new Date()).getTime() < expiredAt) {
        await waitFor(0.5);
        try {
          const _receipt = await fetchTxReceipt(web3, txHash, expiredAt);
          if(_receipt) resolve(_receipt);
          else reject(err);
        } catch(err) {
          reject(err);
        }
      } else {
        reject(new Error(`Transaction ${txHash} was not found`));
      }
    })
  });
};

const getTxReceipt = (web3, { txHash, timeoutInSec }) => {
  return new Promise((resolve, reject) => {
    fetchTxReceipt(web3, txHash, (new Date()).getTime() + (timeoutInSec || 15) * 1000).then(receipt => {
      if (!receipt) {
        reject()
      }
      resolve(receipt);
    }).catch(reject)
  });
};

const handleReceipt = (web3, {txHash, resolve, reject}) => {
  getTxReceipt(web3, { txHash }).then(txReceipt => {
    if (!txReceipt.status) {
      reject(new Error(`Failed tx ${txHash}`))
    }
    resolve(txReceipt);
  });
};


module.exports.networkVersion = (web3) => {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, netId) => {
      if(err) reject(err);
      resolve(parseInt(netId));
    });
  });
};

module.exports.getBalance = (web3, { address }) => {
  return new Promise((resolve, reject) => {
    if (!this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }
    web3.getBalance(address, (err, balance) => {
      if (err) {
        reject(err);
      }
      resolve(balance);
    })
  });
};

module.exports.deployContract = (web3, { from, abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!web3.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    if(from && from.toLowerCase() !== window.ethereum.selectedAddress.toLowerCase()) {
      reject(new Error('From account does not match with selected address.'));
    }

    try {
      const contract = web3.eth.contract(abi);
      const gasPrice = await fetchGasPrice(web3);
      const contractData = contract.new.getData(...params, {data: bytecode, from});
      // const encodeParams = encodeConstructorParams(web3, abi, params || []);
      const estimatedGas = await calculateEstimateGas(web3, { data: contractData });

      contract.new(...params, {
        from: window.ethereum.selectedAddress,
        data: bytecode,
        gas: estimatedGas + estimatedGasThreshold,
        gasPrice
      }, (err, myContract) => {
        if (err) {
          reject(err);
          return;
        }
        // NOTE: The callback will fire twice!
        // Once the contract has the transactionHash property set and once its deployed on an address.
        // e.g. check tx hash on the first call (transaction send)
        if (!myContract.address) {
          handleReceipt(web3, { txHash: myContract.transactionHash, resolve, reject });  // The hash of the transaction, which deploys the contract
        }
        // else {
        //   resolve(myContract);
        // }
      });
    } catch(err) {
      reject(err);
    }

  });
};

module.exports.sendRawTransaction = (web3, rawSignedTx) => {
  throw new Error('Missing implementation');
};

module.exports.sendTransaction = (web3, { to, value }) => {
  return new Promise(async (resolve, reject) => {
    if (!web3.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    let gasPrice = await fetchGasPrice(web3);

    window.eth.sendTransaction({
      from: window.ethereum.selectedAddress,
      value: value,
      gas: 21000,
      gasPrice
    }, (err, txHash) => {
      if (err) {
        reject(err)
      }
      handleReceipt(web3, { txHash, resolve, reject });
    })
  });
};

module.exports.contractCall = (web3, contractAddress, { abi, method, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!web3.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    const contract = window.web3.eth.contract(abi);
    const contractInstance = contract.at(contractAddress);

    // const callData = contractInstance[method].getData(...params);
    // window.web3.eth.call({ to: address, data: callData }, (err, result) => {
    //   debugger;
    //   if (err) reject(err);
    //   resolve(result);
    // });

    if (typeof contractInstance[method] === 'undefined') {
      throw new Error(`Method ${method} is not available`);
    }

    contractInstance[method].call(...params, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.contractSendTx = (web3, contractAddress, { from, abi, method, params, value }) => {
  return new Promise(async (resolve, reject) => {
    if (!web3.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    const contract = web3.eth.contract(abi);
    const contractInstance = contract.at(contractAddress);
    if (typeof contractInstance[method] === 'undefined') {
      throw new Error(`Method ${method} is not available`);
    }

    let gasPrice = await fetchGasPrice(web3);
    const estimatedGas = await (new Promise((resolve, reject) => {
      contractInstance[method].estimateGas(...params, { from, value }, (err, data) => {
        if (err) reject(err);
        // if (err) resolve(9000000);
        else resolve(data);
      })
    }));

    contractInstance[method].sendTransaction(...params, {
      from,
      gas: estimatedGas + estimatedGasThreshold,
      value: value,
      gasPrice
    }, (err, txHash) => {
      if (err) reject(err);
      handleReceipt(web3, { txHash, resolve, reject });
    });
  });
};

module.exports.getTxReceipt = getTxReceipt;
