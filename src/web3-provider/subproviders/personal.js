/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */

const inherits = require('util').inherits;
const Subprovider = require('web3-provider-engine/subproviders/subprovider');
const Keystore = require('../../etherswallet/keystore');

function PersonalSubprovider(provider, opts = {}) {
  this.provider = provider;

  if(opts.unlockAccount) this._unlockAccount = opts.unlockAccount.bind(this);
  if(opts.lockAccount) this._lockAccount = opts.lockAccount.bind(this);
  if(opts.getAccounts) this._getAccounts = opts.getAccounts.bind(this);
  if(opts.newAccount) this._newAccount = opts.newAccount.bind(this);
}

inherits(PersonalSubprovider, Subprovider);

PersonalSubprovider.prototype._getAccounts = function (cb) {
  const addresses = this.provider._getAccounts();
  cb(null, addresses);
};

PersonalSubprovider.prototype._newAccount = function ({ password }, cb) {
  const decryptedWallet = Keystore.createRandomWallet();
  const self = this;

  Keystore.encryptWallet(decryptedWallet, password)
    .then((encryptedJson) => {
      const address = self.provider.importAccount(encryptedJson, decryptedWallet);
      cb(null, address);
    })
    .catch(err => {
      cb(err, null);
    });
};

PersonalSubprovider.prototype._lockAccount = function ({ address }, cb) {
  const self = this;
  try {
    const account = self.provider._getAccount(address);
    account.lock(address);
    cb(null, `Account "${address}" is locked`);
  } catch ( err ) {
    cb(err, null);
  }
};

PersonalSubprovider.prototype._unlockAccount = function ({ address, password, duration }, cb) {
  const self = this;
  try {
    const account = self.provider._getAccount(address);
    account.unlock(password, duration || 0)
      .then(() => {
        cb(null, `Account "${address}" was unlock`);
      })
      .catch(err => cb(err, null));
  } catch ( err ) {
    cb(err, null);
  }
};

PersonalSubprovider.prototype.handleRequest = function(payload, next, end) {
  const self = this;
  switch ( payload.method ) {
    case 'personal_unlockAccount': {
      let { 0: address, 1: password, 2: duration} = payload.params;
      self._unlockAccount({address, password, duration}, end);
      return;
    }
    case 'personal_lockAccount': {
      let { 0: address } = payload.params;
      self._lockAccount({ address }, end);
      return;
    }
    case 'personal_listAccounts': {
      self._getAccounts(end);
      return;
    }
    case 'personal_newAccount': {
      let { 0: password } = payload.params;
      self._newAccount({ password }, end);
      return;
    }
    case 'personal_importRawKey': {
      end(new Error('Missing implementation in PersonalSubprovider'), null);
      return;
    }
    default: {
      next();
      return;
    }
  }
};

module.exports = PersonalSubprovider;