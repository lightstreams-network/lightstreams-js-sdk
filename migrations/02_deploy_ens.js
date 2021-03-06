/**
 * User: ggarrido
 * Date: 2/09/19 15:46
 * Copyright 2019 (c) Lightstreams, Granada
 */

const ensSdk = require('../src/ens/sdk');
const {forceMigration} = require('./00_unlock_account');

const ENSRegistry = artifacts.require('ENSRegistry');

module.exports = function(deployer) {
  const tld = process.env.TLD;
  const domain = process.env.DOMAIN;
  const fromAccount = process.env.ACCOUNT;
  let ensAddress;

  if (!forceMigration('02')) {
    console.log(`Skipped migration "02_deploy_ens.js`);
    return null;
  }

  deployer.deploy(ENSRegistry)
      .then(ensInstance => {
        console.log(`EnsInstance deployed at: ${ensInstance.address}`);
        ensAddress = ensInstance.address;
        return ensSdk.initializeNewRegistry(web3, {
          ensAddress,
          from: fromAccount,
        });
      })
      .then(({resolverAddress}) => {
        console.log(`ENS initialized with resolver ${resolverAddress}.`);
      })
      .then(() => {
        console.log(`Start registration of TLD ${tld}...`);
        return ensSdk.registerNode(web3, {
          ensAddress,
          from: fromAccount,
          subnode: tld,
        }).then(() => {
          console.log(`Registration of TLD "${tld}" completed.`);
        });
      })
      .then(() => {
        console.log(`Start registration of "${domain}.${tld}"...`);
        return ensSdk.registerNode(web3, {
          ensAddress,
          from: fromAccount,
          subnode: domain,
          parentNode: tld,
        }).then(() => {
          console.log(`Registration of domain "${domain}.${tld}" completed.`);
        });
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
};