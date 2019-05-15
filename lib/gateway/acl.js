"use strict";

/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var _require = require('../lib/response'),
    errorResponse = _require.errorResponse;

var request = require('../lib/request');

var GRANT_PERMISSIONS_PATH = '/acl/grant';
var PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports = function (gwDomain) {
  return {
    /**
     * Grant certain file permissions to an account
     * @param acl ACL address obtained after storing a file
     * @param owner Account address of file's owner
     * @param password The password that unlocks the account
     * @param to Account address that will receive the permissions
     * @param permission Permission type to grant (Enum:"read" "write" "admin")
     * @returns {Promise<{ is_granted }>}
     */
    grant: function grant(acl, owner, password, to, permission) {
      if (Object.values(PERMISSIONS).indexOf(permission) === -1) {
        throw errorResponse("\"".concat(permission, "\" is not a valid permission"));
      }

      var data = {
        acl: acl,
        owner: owner,
        password: password,
        to: to,
        permission: permission
      };
      return request.post("".concat(gwDomain).concat(GRANT_PERMISSIONS_PATH), data);
    }
  };
};