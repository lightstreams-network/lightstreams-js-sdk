/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const GRANT_PERMISSIONS_URL = `${urls.GATEWAY_DOMAIN}/acl/grant`;

module.exports.grant = (artistAccount, artistAccountPassword, itemAcl, granteeEthAddress) => {
  const options = {
    json: true,
    body: {
      acl: itemAcl,
      owner: artistAccount,
      password: artistAccountPassword,
      to: granteeEthAddress,
      permission: 'read'
    },
  };

  debug(`POST: ${GRANT_PERMISSIONS_URL}\t${JSON.stringify(options)}`);
  return got.post(GRANT_PERMISSIONS_URL, options)
    .then(gwResponse => {
      const { is_granted, error } = gwResponse.body;
      if (!_.isEmpty(error)) {
        debug(`ERROR: ${err.message}`);
        throw new Error(err.message);
      }

      return {
        is_granted
      }
    }).catch(err => {
      handleGatewayError(err);
    });
};