/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { errorResponse } = require('../lib/response');
const request = require('../lib/request');

const GRANT_PERMISSIONS_PATH = '/acl/grant';
const GRANT_PUBLIC_PATH = '/acl/grant-public';
const REVOKE_PUBLIC_PATH = '/acl/revoke-public';

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports = (gwDomain) => ({
  /**
   * Grant certain file permissions to an account
   * @param acl ACL address obtained after storing a file
   * @param owner Account address of file's owner
   * @param password The password that unlocks the account
   * @param to Account address that will receive the permissions
   * @param permission Permission type to grant (Enum:"read" "write" "admin")
   * @returns {Promise<{ is_granted }>}
   */
  grant: (acl, owner, password, to, permission) => {

    if (Object.values(PERMISSIONS).indexOf(permission) === -1) {
      throw errorResponse(`"${permission}" is not a valid permission`);
    }

    const data = {
        acl,
        owner,
        password,
        to,
        permission
    };

    return request.post(`${gwDomain}${GRANT_PERMISSIONS_PATH}`, data);
  },


  /**
   * Grant certain file permissions to an account
   * @param acl ACL address obtained after storing a file
   * @param owner Account address of file's owner
   * @param password The password that unlocks the account
   * @param to Account address that will receive the permissions
   * @returns {Promise<{ is_granted }>}
   */
  revoke: function grant(acl, owner, password, to) {
    var data = {
      acl: acl,
      owner: owner,
      password: password,
      to: to,
      permission: 'noaccess'
    };
    return request.post("".concat(gwDomain).concat(GRANT_PERMISSIONS_PATH), data);
  },

  /**
   * Grant certain file permissions to an account
   * @param acl ACL address obtained after storing a file
   * @param owner Account address of file's owner
   * @param password The password that unlocks the account
   * @returns {Promise<{ is_granted }>}
   */
  grantPublic: (acl, owner, password) => {

    const data = {
      acl,
      owner,
      password
    };

    return request.post(`${gwDomain}${GRANT_PUBLIC_PATH}`, data);
  },

  /**
   * Grant certain file permissions to an account
   * @param acl ACL address obtained after storing a file
   * @param owner Account address of file's owner
   * @param password The password that unlocks the account
   * @returns {Promise<{ is_granted }>}
   */
  revokePublic: (acl, owner, password) => {

    const data = {
      acl,
      owner,
      password
    };

    return request.post(`${gwDomain}${REVOKE_PUBLIC_PATH}`, data);
  },
});