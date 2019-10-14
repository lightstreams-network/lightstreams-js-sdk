/**
 * User: ggarrido
 * Date: 14/08/19 9:49
 * Copyright 2019 (c) Lightstreams, Granada
 */

const WalletSubprovider = require('../web3-provider/subproviders/wallet');
const Web3Provider = require('../web3-provider');
const Web3 = require('../web3');

module.exports.isInstalled = () => {
  return (typeof window.ethereum !== 'undefined'
    && window.ethereum.isMetaMask);
};

module.exports.isConnected = () => {
  return (this.isInstalled()
    && typeof window.web3 !== 'undefined'
    && window.web3.isConnected());
};

module.exports.isEnabled = () => {
  return (this.isConnected()
    && typeof window.ethereum.selectedAddress !== 'undefined');
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

module.exports.web3 = (opts = {}) => {
  const providerEngine = window.web3;
  // const chainId = parseInt(web3.currentProvider.networkVersion);
  const selectedAddr = window.ethereum.selectedAddress.toLowerCase();

  if(!opts.rpcUrl) {
    throw new Error(`Missing option "rpcUrl"`);
  }

  const walletSubprovider = WalletSubprovider(providerEngine, {
    getAccounts: (cb) => {
      providerEngine.eth.getAccounts(cb)
    },
    signMessage: (payload, cb) => {
      try {
        const { from, data } = payload;
        if (from.toLowerCase() !== selectedAddr) {
          cb(new Error(`Selected metamask address is not expected ${from}`), null);
        }

        // providerEngine.sign(web3.toHex("msg"), web3.eth.defaultAccount, (err, res) => console.log(err, res))
        providerEngine.personal.sign(data, from, (err, res) => {
          cb(err, res);
        });
      } catch ( err ) {
        if (typeof cb === 'function') cb(err, '0x0');
        else throw err
      }
    },
    signTransaction: (payload, cb) => {
      try {
        const { gas, from, ...params } = payload;
        const txParams = {
          ...params,
          gasLimit: gas,
        };

        if (from.toLowerCase() !== selectedAddr) {
          cb(new Error(`Selected metamask address is not expected ${from}`), null);
        }

        providerEngine.personal.signTransaction(txParams, from, (err, res) => {
          cb(err, res);
        });
      } catch ( err ) {
        if (typeof cb === 'function') cb(err, '0x0');
        else throw err
      }
    }
  });

  const provider = Web3Provider({ rpcUrl: opts.rpcUrl }, walletSubprovider);
  return Web3.newEngine(provider);
};

// web3.personal.sign(web3.toHex("msg"), web3.eth.defaultAccount, (err, res) => console.log(err, res))
// web3.currentProvider.networkVersion
// window.ethereum.selectedAddress