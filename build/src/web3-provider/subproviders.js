"use strict";

/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */
var inherits = require('util').inherits;

var Subprovider = require('web3-provider-engine/subproviders/subprovider');

function PersonalSubprovider(opts) {
  var self = this;
  self.unlockAccount = opts.unlockAccount || mustProvideInConstructor('unlockAccount');
  self.lockAccount = opts.lockAccount || mustProvideInConstructor('lockAccount');
  self.getAccounts = opts.getAccounts || mustProvideInConstructor('getAccounts');
  self.newAccount = opts.newAccount || mustProvideInConstructor('newAccount');
}

inherits(PersonalSubprovider, Subprovider);

PersonalSubprovider.prototype.handleRequest = function (payload, next, end) {
  var self = this;

  switch (payload.method) {
    case 'personal_unlockAccount':
      {
        var _payload$params = payload.params,
            address = _payload$params[0],
            password = _payload$params[1],
            duration = _payload$params[2];
        self.unlockAccount({
          address: address,
          password: password,
          duration: duration
        }, end);
        return;
      }

    case 'personal_lockAccount':
      {
        var _address = payload.params[0];
        self.lockAccount({
          address: _address
        }, end);
        return;
      }

    case 'personal_listAccounts':
      {
        self.getAccounts(end);
        return;
      }

    case 'personal_newAccount':
      {
        var _password = payload.params[0];
        self.newAccount({
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

module.exports.PersonalSubprovider = PersonalSubprovider;