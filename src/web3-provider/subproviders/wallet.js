/**
 * User: ggarrido
 * Date: 9/10/19 18:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');

function mustProvideInConstructor(methodName) {
  throw new Error('ProviderEngine - LsWalletSubprovider - Must provide "' + methodName + '" fn in constructor options')
}

// Wrapper class to encapsulate initialization of `web3-provider-engine`
// and facilitate its usage
module.exports = function WalletSubprovider(opts = {}) {
  if(typeof opts.getAccounts !== 'function') {
    mustProvideInConstructor('getAccounts')
  }

  if (typeof opts.signMessage !== 'function') {
    mustProvideInConstructor('signMessage')
  }

  if (typeof opts.signTransaction !== 'function') {
    mustProvideInConstructor('signTransaction')
  }

  return new HookedWalletSubprovider({
    getAccounts: opts.getAccounts,
    signMessage: opts.signMessage,
    signTransaction: opts.signTransaction
  })
};