/**
 * User: ggarrido
 * Date: 14/08/19 9:49
 * Copyright 2019 (c) Lightstreams, Granada
 */


const fetchGasPrice = () => {
  return new Promise((resolve, reject) => {
    window.web3.eth.getGasPrice((err, result) => {
      if (err) reject(err);
      resolve(result)
    });
  })
};

const calculateEstimateGas = ({ data, to }) => {
  return new Promise((resolve, reject) => {
    window.web3.eth.estimateGas({ data, to }, (err, result) => {
      if (err) reject(err);
      resolve(result)
    });
  });
};

module.exports.isInstalled = () => {
  return (typeof window.ethereum !== 'undefined'
    && window.ethereum.isMetaMask);
};

module.exports.isConnected = () => {
  return (this.isInstalled
    && typeof window.web3 !== 'undefined'
    && window.web3.isConnected());
};

module.exports.isEnabled = () => {
  return (this.isConnected()
    && typeof window.ethereum.selectedAddress !== 'undefined');
};

module.exports.networkVersion = () => {
  if(!this.isConnected()) {
    return null;
  }
  return parseInt(window.ethereum.networkVersion);
};

module.exports.enable = () => {
  return window.ethereum.enable();
};

module.exports.selectedAddress = () => {
  if (!this.isConnected()) {
    throw new Error('Web3 is not connected');
  }
  return window.ethereum.selectedAddress;
};

module.exports.getBalance = (address) => {
  return new Promise((resolve, reject) => {
    if (!this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }
    window.web3.getBalance(address, (err, balance) => {
      if (err) {
        reject(err);
      }
      resolve(balance);
    })
  });
};

module.exports.deployContract = ({ abi, bytecode, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    const contract = window.web3.eth.contract(abi);
    const gasPrice = await fetchGasPrice();
    const estimatedGas = await calculateEstimateGas({ data: bytecode });

    contract.new(...params, {
      from: window.ethereum.selectedAddress,
      data: bytecode,
      gas: estimatedGas,
      gasPrice
    }, (err, myContract) => {
      if (err) {
        reject(err)
      } else {
        // NOTE: The callback will fire twice!
        // Once the contract has the transactionHash property set and once its deployed on an address.
        // e.g. check tx hash on the first call (transaction send)
        if (!myContract.address) {
          resolve(myContract.transactionHash) // The hash of the transaction, which deploys the contract
        }
        // else {
        //   resolve(myContract);
        // }
      }
    });
  });
};

module.exports.sendTx = ({ to, value }) => {
  return new Promise(async (resolve, reject) => {
    if (!this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    let gasPrice = await fetchGasPrice();

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

module.exports.contractCall = ({ abi, address, method, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    const contract = window.web3.eth.contract(abi);
    const contractInstance = contract.at(address);

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

module.exports.contractSendTx = ({ abi, address, method, params }) => {
  return new Promise(async (resolve, reject) => {
    if (!this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    const contract = window.web3.eth.contract(abi);
    const contractInstance = contract.at(address);
    const estimatedGas = await(new Promise((resolve, reject) => {
      contractInstance[method].estimateGas(...params, (err, data) => {
        if(err) reject(err);
        else resolve(data);
      })
    }));

    let gasPrice = await fetchGasPrice();
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
