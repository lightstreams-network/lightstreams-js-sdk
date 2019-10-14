"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * User: ggarrido
 * Date: 2/09/19 11:29
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3ProviderEngine = require('web3-provider-engine');

var Account = require('../etherswallet/account');

var ProviderEngine =
/*#__PURE__*/
function (_Web3ProviderEngine) {
  _inherits(ProviderEngine, _Web3ProviderEngine);

  function ProviderEngine() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ProviderEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProviderEngine).call(this, opts));
    _this.wallets = {};
    _this.network = opts.network || {
      name: 'mainnet',
      networkId: 163,
      chainId: 163
    };
    return _this;
  }

  _createClass(ProviderEngine, [{
    key: "importAccount",
    value: function importAccount(encryptedJson) {
      var decryptedWallet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this;
      var account = Account.newAccount(encryptedJson, decryptedWallet);
      self.wallets[account.address] = account;
      return account.address;
    }
  }, {
    key: "exportAccount",
    value: function exportAccount(address) {
      var self = this;
      address = Account.formatAddress(address);

      if (typeof self.wallets[address] === 'undefined') {
        throw new Error("Address ".concat(address, " is not found."));
      }

      return self.wallets[address]["export"]();
    }
  }, {
    key: "isAccountLocked",
    value: function isAccountLocked(address) {
      var self = this;
      address = Account.formatAddress(address);

      if (typeof self.wallets[address] === 'undefined') {
        throw new Error("Address ".concat(address, " is not found."));
      }

      return self.wallets[address].isLocked();
    }
  }, {
    key: "setNetwork",
    value: function setNetwork(network) {
      this.network = network;
    }
  }, {
    key: "chainId",
    value: function chainId() {
      return this.network.chainId;
    }
  }, {
    key: "_getAccount",
    value: function _getAccount(address) {
      var self = this;
      address = Account.formatAddress(address);

      if (typeof self.wallets[address] === 'undefined') {
        throw new Error("Address ".concat(address, " is not found."));
      }

      return self.wallets[address];
    }
  }, {
    key: "_getAccounts",
    value: function _getAccounts() {
      var self = this;
      return Object.keys(self.wallets).map(Account.formatAddress);
    } // Copyrights by @Portis team
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

  }]);

  return ProviderEngine;
}(Web3ProviderEngine);

module.exports = ProviderEngine;