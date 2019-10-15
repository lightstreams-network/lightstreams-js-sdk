/**
 * User: ggarrido
 * Date: 2/09/19 15:46
 * Copyright 2019 (c) Lightstreams, Granada
 */

const ensSdk = require('../src/ens/sdk');

const ENSRegistry = artifacts.require("ENSRegistry");

module.exports = function(deployer) {
  const tld = process.env.TLD;
  const domain = process.env.DOMAIN;
  const fromAccount = process.env.ACCOUNT;
  let ensAddress;

  deployer.then(() => {
    return ENSRegistry.deployed();
  }).then((curInstance) => {
    if (curInstance.address && !global.forceMigration('02')) {
      console.log(`Contract already deployed ${curInstance.address}. Skipped migration "02_deploy_ens.js`);
      return null;
    }

    return deployer.deploy(ENSRegistry)
      .then(instance => {
        ensAddress = instance.address;
        return ensSdk.initializeNewRegistry(web3, {
          ensAddress,
          from: fromAccount
        }).then(({ resolverAddress }) => {
          console.log(`ENS initialized with resolver ${resolverAddress}.`)
        })
      })
      .then(() => {
        console.log(`Start registration of TLD ${tld}...`);
        return ensSdk.registerNode(web3, {
          ensAddress,
          from: fromAccount,
          subnode: tld
        }).then(() => {
          console.log(`Registration of TLD "${tld}" completed.`);
        })
      })
      .then(() => {
        console.log(`Start registration of "${domain}.${tld}"...`);
        return ensSdk.registerNode(web3, {
          ensAddress,
          from: fromAccount,
          subnode: domain,
          parentNode: tld
        }).then(() => {
          console.log(`Registration of domain "${domain}.${tld}" completed.`);
        });
      });
  });
};