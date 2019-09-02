/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */


const fetchGasPrice = (web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.getGasPrice((err, result) => {
      if (err) reject(err);
      resolve(result)
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

module.exports.deployContract = (web3, { abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!web3.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }
    const contract = web3.eth.contract(abi);
    const gasPrice = await fetchGasPrice(web3);
    const estimatedGas = await calculateEstimateGas(web3, { data: bytecode });

    contract.new(...params, {
      from: window.ethereum.selectedAddress,
      data: bytecode,
      gas: estimatedGas,
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
        resolve(myContract.transactionHash) // The hash of the transaction, which deploys the contract
      }
      // else {
      //   resolve(myContract);
      // }
    });
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
    }, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result);
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

    contractInstance[method].call(...params, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.contractSendTx = (web3, contractAddress, { abi, method, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!web3.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    const contract = web3.eth.contract(abi);
    const contractInstance = contract.at(contractAddress);
    const estimatedGas = await (new Promise((resolve, reject) => {
      contractInstance[method].estimateGas(...params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      })
    }));

    let gasPrice = await fetchGasPrice(web3);
    contractInstance[method](...params, {
      from: window.ethereum.selectedAddress,
      gas: estimatedGas,
      gasPrice
    }, (err, txHash) => {
      if (err) reject(err);
      resolve(txHash);
    });
  });
};

module.exports.getTxReceipt = (web3, { txHash, timeoutInSec }) => {
  throw new Error('Missing implementation');
};
