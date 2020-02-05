/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
const ethers = require('ethers');
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions');
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

const ProviderEngine = require('./engine');
const { PersonalSubprovider, GsnSubprovider, WalletSubprovider } = require('./subproviders');

module.exports = (opts = {}, walletSubprovider = null) => {
  const { rpcUrl, ...engineOpts } = opts;
  const lsProviderEngine = new ProviderEngine(engineOpts);
  const version = '0.8.0';

  // @TODO Decouple from etherswallet module
  const jsonProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  jsonProvider.send('net_version').then(version => {
    chainId = parseInt(version);
    switch ( chainId ) {
      case 161:
        lsProviderEngine.setNetwork({ name: 'standalone', networkId: chainId, chainId: chainId, hardfork: 'constantinople' });
        break;
      case 162:
        lsProviderEngine.setNetwork({ name: 'sirius', networkId: chainId, chainId: chainId, hardfork: 'petersburg' });
        break;
      case 163:
        lsProviderEngine.setNetwork({ name: 'mainnet', networkId: chainId, chainId: chainId, hardfork: 'petersburg' });
        break;
      default:
        lsProviderEngine.setNetwork({ name: 'unknown', networkId: chainId, chainId: chainId });
    }
  });

  lsProviderEngine.host = rpcUrl;
  lsProviderEngine.addProvider(new FixtureSubprovider({
    web3_clientVersion: `Lightstreams/v${version}/javascript`,
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
  }));

  lsProviderEngine.addProvider(new SubscriptionsSubprovider());
  lsProviderEngine.addProvider(new FilterSubprovider());
  lsProviderEngine.addProvider(new NonceSubprovider());

  lsProviderEngine.addProvider(new GsnSubprovider(lsProviderEngine, {
    useGSN: false,
    ...engineOpts,
    jsonRpcSend: jsonProvider.send.bind(jsonProvider)
  }));

  if (!walletSubprovider) {
    // Initialize default wallet subprovider using in memory wallets
    walletSubprovider = WalletSubprovider({
      getAccounts: (cb) => {
        const addresses = lsProviderEngine._getAccounts();
        cb(null, addresses);
      },
      signMessage: (payload, cb) => {
        try {
          const { from, data } = payload;
          const account = lsProviderEngine._getAccount(from);
          account.signMsg({ data, chainId: lsProviderEngine._getChainId() }, cb);
        } catch ( err ) {
          if (typeof cb === 'function') cb(err, '0x0');
          else throw err
        }
      },
      signTransaction: (payload, cb) => {
        try {
          const { gas, from, useGSN, ...params } = payload;
          const txParams = {
            ...params,
            gasLimit: gas,
          };

          const account = lsProviderEngine._getAccount(from);
          account.signTx({ ...txParams, chainId: lsProviderEngine._getChainId() }, cb);
        } catch ( err ) {
          if (typeof cb === 'function') cb(err, '0x0');
          else throw err
        }
      },
    });
  }

  lsProviderEngine.addProvider(walletSubprovider);

  lsProviderEngine.addProvider(new PersonalSubprovider(lsProviderEngine));

  lsProviderEngine.addProvider(new RpcSubprovider({
    rpcUrl: rpcUrl, // Expected to be
  }));

  // network connectivity error
  lsProviderEngine.on('error', function(err) {
    // report connectivity errors
    console.error(err.stack)
  });

  // start polling for blocks
  lsProviderEngine.start();

  return lsProviderEngine;
};