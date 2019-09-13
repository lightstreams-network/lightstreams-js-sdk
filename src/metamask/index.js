/**
 * User: ggarrido
 * Date: 14/08/19 9:49
 * Copyright 2019 (c) Lightstreams, Granada
 */

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

module.exports.web3 = () => {
  return window.web3;
};
