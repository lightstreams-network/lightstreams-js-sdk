/**
 * User: ggarrido
 * Date: 2/09/19 11:29
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3ProviderEngine = require('web3-provider-engine');

const Account = require('../etherswallet/account');

class ProviderEngine extends Web3ProviderEngine {
  constructor(opts = {}) {
    super(opts);
    this.wallets = {};
    this.network = opts.network || { name: 'mainnet', networkId: 163, chainId: 163, hardfork: 'byzantium' }
  }

  importAccount(encryptedJson, decryptedWallet = null) {
    const self = this;
    const account = Account.newAccount(encryptedJson, decryptedWallet);
    self.wallets[account.address] = account;
    return account.address;
  };

  exportAccount(address) {
    const self = this;
    address = Account.formatAddress(address);
    if (typeof self.wallets[address] === 'undefined') {
      throw new Error(`Address ${address} is not found.`);
    }

    return self.wallets[address].export();
  };

  isAccountLocked(address) {
    const self = this;
    address = Account.formatAddress(address);
    if (typeof self.wallets[address] === 'undefined') {
      throw new Error(`Address ${address} is not found.`);
    }

    return self.wallets[address].isLocked();
  }

  setNetwork(network) {
    this.network = network;
  }

  _getChainId() {
    return this.network.chainId;
  }

  _getAccount(address) {
    const self = this;
    address = Account.formatAddress(address);
    if (typeof self.wallets[address] === 'undefined') {
      throw new Error(`Address ${address} is not found.`);
    }
    return self.wallets[address];
  };

  _getAccounts() {
    const self = this;
    return Object.keys(self.wallets).map(Account.formatAddress)
  }

  // Copyrights by @Portis team
  // https://github.com/portis-project/web-sdk/blob/master/packages/portis-web3/src/index.ts
  // send(payload, callback) {
  //   const self = this;
  //   // Web3 1.0 beta.38 (and above) calls `send` with method and parameters
  //   if (typeof payload === 'string') {
  //     return new Promise((resolve, reject) => {
  //       self.sendAsync(
  //         {
  //           jsonrpc: '2.0',
  //           id: 42,
  //           method: payload,
  //           params: callback || [],
  //         },
  //         (error, response) => {
  //           if (error) {
  //             reject(error);
  //           } else {
  //             resolve(response.result);
  //           }
  //         },
  //       );
  //     });
  //   }
  //
  //   // Web3 1.0 beta.37 (and below) uses `send` with a callback for async queries
  //   if (callback) {
  //     self.sendAsync(payload, callback);
  //     return;
  //   }
  //
  //   let result = null;
  //   switch ( payload.method ) {
  //     case 'eth_accounts':
  //       result = this._selectedAddress ? [this._selectedAddress] : [];
  //       break;
  //
  //     case 'eth_coinbase':
  //       result = this._selectedAddress ? [this._selectedAddress] : [];
  //       break;
  //
  //     case 'net_version':
  //       result = this._network;
  //       break;
  //
  //     case 'eth_uninstallFilter':
  //       self.sendAsync(payload, _ => _);
  //       result = true;
  //       break;
  //
  //     default:
  //       var message = `The Lightstreams Web3 object does not support synchronous methods like ${
  //         payload.method
  //         } without a callback parameter.`;
  //       throw new Error(message);
  //   }
  //
  //   return {
  //     id: payload.id,
  //     jsonrpc: payload.jsonrpc,
  //     result: result,
  //   };
  // }
}

module.exports = ProviderEngine;
