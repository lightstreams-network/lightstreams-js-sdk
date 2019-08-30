/**
 * User: ggarrido
 * Date: 28/08/19 14:42
 * Copyright 2019 (c) Lightstreams, Granada
 */
const ethers = require('ethers');
const Util = require('ethereumjs-util');
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');
const ProviderEngine = require('web3-provider-engine');
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet');
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions');
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const { PersonalSubprovider } = require('./subproviders');


module.exports = ({ rpcUrl, accounts }) => {
  const engine = new ProviderEngine();
  const version = '0.0.1';
  const wallets = {};

  (accounts || []).forEach(account => {
    wallets[account.address] = account;
  });

  let network;
  const jsonProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  jsonProvider.send('net_version').then(version => {
    chainId = parseInt(version);
    // The second parameter is not necessary if these values are used
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

  // Copyrights to @Portis team
  // https://github.com/portis-project/web-sdk/blob/master/packages/portis-web3/src/index.ts
  engine.send = (payload, callback) => {
    // Web3 1.0 beta.38 (and above) calls `send` with method and parameters
    if (typeof payload === 'string') {
      return new Promise((resolve, reject) => {
        engine.sendAsync(
          {
            jsonrpc: '2.0',
            id: 42,
            method: payload,
            params: callback || [],
          },
          (error, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(response.result);
            }
          },
        );
      });
    }

    // Web3 1.0 beta.37 (and below) uses `send` with a callback for async queries
    if (callback) {
      engine.sendAsync(payload, callback);
      return;
    }

    let result = null;
    switch ( payload.method ) {
      case 'eth_accounts':
        result = this._selectedAddress ? [this._selectedAddress] : [];
        break;

      case 'eth_coinbase':
        result = this._selectedAddress ? [this._selectedAddress] : [];
        break;

      case 'net_version':
        result = this._network;
        break;

      case 'eth_uninstallFilter':
        engine.sendAsync(payload, _ => _);
        result = true;
        break;

      default:
        var message = `The Portis Web3 object does not support synchronous methods like ${
          payload.method
          } without a callback parameter.`;
        throw new Error(message);
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result: result,
    };
  };

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
      const addresses = Object.keys(wallets);
      cb(null, addresses);
    },
    signTransaction: (payload, cb) => {
      try {
        const { gas, from, ...params } = payload;
        const txParams = {
          ...params,
          gasLimit: gas,
        };

        const account = wallets[from];
        account.signTx({ ...txParams, chainId: network.chainId}, cb);
      } catch ( err ) {
        if (typeof cb === 'function') cb(err, '0x0');
        else throw err
      }
    },
  }));

  // engine.addProvider(new PersonalSubprovider({ wallets }));

  engine.addProvider(new RpcSubprovider({
    rpcUrl: rpcUrl, // Expected to be
  }));

  // network connectivity error
  engine.on('error', function(err) {
    // report connectivity errors
    console.error(err.stack)
  });

  engine.appendAccount = (account) => {
    wallets[account.address] = account;
  };

  engine.getAccount = (address) => {
    address = Util.addHexPrefix(address).toLowerCase();
    if (typeof wallets[address] === 'undefined') {
      throw new Error(`Address ${address} is not found.`);
    }
    return wallets[address];
  };

  // start polling for blocks
  engine.start();

  return engine;
};
