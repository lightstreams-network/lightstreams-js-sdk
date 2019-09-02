"use strict";

/**
 * User: ggarrido
 * Date: 30/08/19 18:05
 * Copyright 2019 (c) Lightstreams, Granada
 */
var inherits = require('util').inherits;

var Subprovider = require('web3-provider-engine/subproviders/subprovider');

module.exports = PersonalSubprovider;
inherits(PersonalSubprovider, Subprovider);

function PersonalSubprovider(opts) {
  var self = this;
  self.wallets = opts.wallets || {};
}

PersonalSubprovider.prototype.handleRequest = function (payload, next, end) {
  var self = this;

  switch (payload.method) {
    case 'personal_unlockAccount':
      debugger; // process normally

      self.getAccounts(function (err, accounts) {
        if (err) return end(err);
        var result = accounts[0] || null;
        end(null, result);
      });
      return;

    default:
      next();
      return;
  }
};