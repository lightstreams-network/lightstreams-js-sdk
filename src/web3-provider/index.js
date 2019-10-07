/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
const ethers = require('ethers');
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions');
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

const ProviderEngine = require('./engine');
const { PersonalSubprovider } = require('./subproviders');
const Keystore = require('../etherswallet/keystore');

// @TODO Decouple from etherswallet module
module.exports = (opts = {}) => {
  const { rpcUrl, ...engineOpts } = opts;
  const engine = new ProviderEngine(engineOpts);
  const version = '0.0.1';

  let network;
  const jsonProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  jsonProvider.send('net_version').then(version => {
    chainId = parseInt(version);
    // The possible `hardfork` parameter values
    // - `Byzantium`
    // - `Constantinople`
    // - `Petersburg`
    switch ( chainId ) {
      case 161:
        network = { name: 'standalone', networkId: chainId, chainId: chainId };
        break;
      case 162:
        network = { name: 'sirius', networkId: chainId, chainId: chainId };
        break;
      case 163:
        network = { name: 'mainnet', networkId: chainId, chainId: chainId };
        break;
      default:
        throw new Error(`Unsupported chainId ${version}`)
    }
  });

  engine.host = rpcUrl;

  engine.addProvider(new FixtureSubprovider({
    web3_clientVersion: `Lightstreams/v${version}/javascript`,
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
  }));

  engine.addProvider(new SubscriptionsSubprovider());
  engine.addProvider(new FilterSubprovider());
  engine.addProvider(new NonceSubprovider());

  engine.addProvider(new HookedWalletSubprovider({
    getAccounts: (cb) => {
      const addresses = engine._getAccounts();
      cb(null, addresses);
    },
    signTransaction: (payload, cb) => {
      try {
        const { gas, from, ...params } = payload;
        const txParams = {
          ...params,
          gasLimit: gas,
        };

        const account = engine._getAccount(from);
        account.signTx({ ...txParams, chainId: network.chainId }, cb);
      } catch ( err ) {
        if (typeof cb === 'function') cb(err, '0x0');
        else throw err
      }
    },
  }));

  engine.addProvider(new PersonalSubprovider({
    getAccounts: (cb) => {
      const addresses = engine._getAccounts();
      cb(null, addresses);
    },
    newAccount: ({ password }, cb) => {
      const decryptedWallet = Keystore.createRandomWallet();
      Keystore.encryptWallet(decryptedWallet, password)
        .then((encryptedJson) => {
          const address = engine.importAccount(encryptedJson, decryptedWallet);
          cb(null, address);
        })
        .catch(err => {
          cb(err, null);
        });
    },
    lockAccount: ({ address }, cb) => {
      try {
        const account = engine._getAccount(address);
        account.lock(address);
        cb(null, `Account "${address}" is locked`);
      } catch ( err ) {
        cb(err, null);
      }
    },
    unlockAccount: ({ address, password, duration }, cb) => {
      try {
        const account = engine._getAccount(address);
        account.unlock(password, duration || 0)
          .then(() => {
            cb(null, `Account "${address}" was unlock`);
          })
          .catch(err => cb(err, null));
      } catch ( err ) {
        cb(err, null);
      }
    }
  }));

  engine.addProvider(new RpcSubprovider({
    rpcUrl: rpcUrl, // Expected to be
  }));

  // network connectivity error
  engine.on('error', function(err) {
    // report connectivity errors
    console.error(err.stack)
  });

  // start polling for blocks
  engine.start();

  return engine;
};