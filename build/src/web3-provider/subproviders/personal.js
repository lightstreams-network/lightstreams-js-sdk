"use strict";

/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */
var inherits = require('util').inherits;

var Subprovider = require('web3-provider-engine/subproviders/subprovider');

var Keystore = require('../../etherswallet/keystore');

function PersonalSubprovider(provider) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.provider = provider;
  if (opts.unlockAccount) this._unlockAccount = opts.unlockAccount.bind(this);
  if (opts.lockAccount) this._lockAccount = opts.lockAccount.bind(this);
  if (opts.getAccounts) this._getAccounts = opts.getAccounts.bind(this);
  if (opts.newAccount) this._newAccount = opts.newAccount.bind(this);
}

inherits(PersonalSubprovider, Subprovider);

PersonalSubprovider.prototype._getAccounts = function (cb) {
  var addresses = this.provider._getAccounts();

  cb(null, addresses);
};

PersonalSubprovider.prototype._newAccount = function (_ref, cb) {
  var password = _ref.password;
  var decryptedWallet = Keystore.createRandomWallet();
  var self = this;
  Keystore.encryptWallet(decryptedWallet, password).then(function (encryptedJson) {
    var address = self.provider.importAccount(encryptedJson, decryptedWallet);
    cb(null, address);
  })["catch"](function (err) {
    cb(err, null);
  });
};

PersonalSubprovider.prototype._lockAccount = function (_ref2, cb) {
  var address = _ref2.address;
  var self = this;

  try {
    var account = self.provider._getAccount(address);

    account.lock(address);
    cb(null, "Account \"".concat(address, "\" is locked"));
  } catch (err) {
    cb(err, null);
  }
};

PersonalSubprovider.prototype._unlockAccount = function (_ref3, cb) {
  var address = _ref3.address,
      password = _ref3.password,
      duration = _ref3.duration;
  var self = this;

  try {
    var account = self.provider._getAccount(address);

    account.unlock(password, duration || 0).then(function () {
      cb(null, "Account \"".concat(address, "\" was unlock"));
    })["catch"](function (err) {
      return cb(err, null);
    });
  } catch (err) {
    cb(err, null);
  }
};

PersonalSubprovider.prototype.handleRequest = function (payload, next, end) {
  var self = this;

  switch (payload.method) {
    case 'personal_unlockAccount':
      {
        var _payload$params = payload.params,
            address = _payload$params[0],
            password = _payload$params[1],
            duration = _payload$params[2];

        self._unlockAccount({
          address: address,
          password: password,
          duration: duration
        }, end);

        return;
      }

    case 'personal_lockAccount':
      {
        var _address = payload.params[0];

        self._lockAccount({
          address: _address
        }, end);

        return;
      }

    case 'personal_listAccounts':
      {
        self._getAccounts(end);

        return;
      }

    case 'personal_newAccount':
      {
        var _password = payload.params[0];

        self._newAccount({
          password: _password
        }, end);

        return;
      }

    case 'personal_importRawKey':
      {
        end(new Error('Missing implementation in PersonalSubprovider'), null);
        return;
      }

    default:
      {
        next();
        return;
      }
  }
};

module.exports = PersonalSubprovider;