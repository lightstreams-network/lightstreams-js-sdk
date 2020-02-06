const {initializeProfileFactory} = require('../src/contracts/profile');
const Web3 = require('../src/web3');
const {forceMigration} = require('./00_unlock_account');

const ProfileFactory = artifacts.require('GSNProfileFactory');

module.exports = function(deployer) {
  const faucetFundingInPht = process.env.PROFILE_FACTORY_FAUCET || '100';
  const factoryFundingInPht = process.env.GSN_PROFILE_FACTORY_FUNDING || '50';
  const profileFundingInPht = process.env.GSN_PROFILE_FUNDING || '10';
  const profileFundingInWei = Web3.utils.toWei(profileFundingInPht);
  const relayHub = process.env.RELAY_HUB;

  if (!forceMigration('01')) {
    console.log(`Skipped migration "01_deploy_gsn_profile_factory.js"`);
    return;
  }

  deployer.then(() => {
    return deployer.deploy(ProfileFactory, profileFundingInWei)
        .then((profileFactoryInstance) => {
          console.log(`ProfileFactoryInstance deployed at: ${profileFactoryInstance.address}`);
          return initializeProfileFactory(web3, {
            contractAddr: profileFactoryInstance.address,
            relayHub: relayHub,
            from: process.env.ACCOUNT,
            factoryFundingInPht: factoryFundingInPht,
            faucetFundingInPht: faucetFundingInPht,
          });
        });
  }).catch(err => {
    console.error(err);
    throw err;
  });
};
