/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { extractResponse, defaultOptions } = require('../lib/gateway');

const GRANT_PERMISSIONS_PATH = '/acl/grant';

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports = (gwDomain) => ({
  /**
   *
   * @param acl
   * @param owner
   * @param password
   * @param to
   * @param permission
   * @returns {Promise<*>}
   */
  grant: async (acl, owner, password, to, permission) => {

    if (_.values(PERMISSIONS).indexOf(permission) === -1) {
      throw ErrorResponse(`"${permission}" is not a valid permission`);
    }

    const options = {
      ...defaultOptions,
      body: {
        acl,
        owner,
        password,
        to,
        permission
      },
    };

    const gwResponse = await got.post(`${gwDomain}${GRANT_PERMISSIONS_PATH}`, options);
    return extractResponse(gwResponse);
  }
});