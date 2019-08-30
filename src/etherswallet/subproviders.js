/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */

const inherits = require('util').inherits;
const Subprovider = require('web3-provider-engine/subproviders/subprovider');

module.exports = PersonalSubprovider;

inherits(PersonalSubprovider, Subprovider);

function PersonalSubprovider(opts) {
  const self = this
  self.wallets = opts.wallets || {};
}

PersonalSubprovider.prototype.handleRequest = function(payload, next, end) {
  const self = this

  switch ( payload.method ) {

    case 'personal_unlockAccount':
      debugger;
      // process normally
      self.getAccounts(function(err, accounts) {
        if (err) return end(err)
        let result = accounts[0] || null;
        end(null, result)
      })
      return

    default:
      next()
      return

  }
}