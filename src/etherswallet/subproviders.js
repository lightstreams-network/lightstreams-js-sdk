/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */

const inherits = require('util').inherits;
const Subprovider = require('web3-provider-engine/subproviders/subprovider');


function PersonalSubprovider(opts) {
  const self = this;
  self.unlockAccount = opts.unlockAccount || mustProvideInConstructor('unlockAccount');
  self.lockAccount = opts.lockAccount || mustProvideInConstructor('lockAccount');
  self.getAccounts = opts.getAccounts || mustProvideInConstructor('getAccounts');
  self.newAccount = opts.newAccount || mustProvideInConstructor('newAccount');
}

inherits(PersonalSubprovider, Subprovider);

PersonalSubprovider.prototype.handleRequest = function(payload, next, end) {
  const self = this;
  switch ( payload.method ) {
    case 'personal_unlockAccount': {
      let { 0: address, 1: password, 2: duration} = payload.params;
      self.unlockAccount({address, password, duration}, end);
      return;
    }
    case 'personal_lockAccount': {
      let { 0: address } = payload.params;
      self.lockAccount({ address }, end);
      return;
    }
    case 'personal_listAccounts': {
      self.getAccounts(end);
      return;
    }
    case 'personal_newAccount': {
      let { 0: password } = payload.params;
      self.newAccount({ password }, end);
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

module.exports.PersonalSubprovider = PersonalSubprovider;