/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { ErrorGatewayResponse } = require('../lib/response');
const { ErrorResponse } = require('../lib/response');

const GRANT_PERMISSIONS_PATH = '/acl/grant';

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports.grant = (gwDomain) => async (acl, owner, password, to, permission) => {

  if (_.values(PERMISSIONS).indexOf(permission) === -1) {
    throw ErrorResponse(`"${permission}" is not a valid permission`);
  }

  const options = {
    json: true,
    throwHttpErrors: false,
    body: {
      acl,
      owner,
      password,
      to,
      permission
    },
  };

  const gwResponse = await got.post(`${gwDomain}${GRANT_PERMISSIONS_PATH}`, options);
  const { error, ...response } = gwResponse.body;
  if (!_.isEmpty(error)) {
    throw ErrorGatewayResponse(error);
  }

  return response;
};