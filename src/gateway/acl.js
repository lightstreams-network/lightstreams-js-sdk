/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { errorResponse } = require('../lib/response');
const request = require('../lib/request');

const GRANT_PERMISSIONS_PATH = '/acl/grant';

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
  }
});