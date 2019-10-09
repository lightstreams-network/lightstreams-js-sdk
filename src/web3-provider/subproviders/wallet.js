/**
 * User: ggarrido
 * Date: 9/10/19 18:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');

module.exports = function WalletSubprovider(provider, opts = {}) {
  return new HookedWalletSubprovider({
    getAccounts: opts.getAccounts || ((cb) => {
      const addresses = provider._getAccounts();
      cb(null, addresses);
    }),
    signMessage: opts.signMessage || ((payload, cb) => {
      try {
        const { from, data } = payload;
        const account = provider._getAccount(from);
        account.signMsg({ data, chainId: provider.chainId() }, cb);
      } catch ( err ) {
        if (typeof cb === 'function') cb(err, '0x0');
        else throw err
      }
    }),
    signTransaction: opts.signTransaction || ((payload, cb) => {
      try {
        const { gas, from, ...params } = payload;
        const txParams = {
          ...params,
          gasLimit: gas,
        };

        const account = provider._getAccount(from);
        account.signTx({ ...txParams, chainId: provider.chainId() }, cb);
      } catch ( err ) {
        if (typeof cb === 'function') cb(err, '0x0');
        else throw err
      }
    }),
  })
};