const { initializeProfileFactory } = require('../src/contracts/profile');
const Web3 = require('../src/web3');
const {forceMigration} = require('./00_unlock_account');

const ProfileFactory = artifacts.require("GSNProfileFactory");

module.exports = function(deployer) {
  const faucetFundingInPht = process.env.PROFILE_FACTORY_FAUCET || '100';
  const factoryFundingInPht = process.env.GSN_PROFILE_FACTORY_FUNDING || '50';
  const profileFundingInPht = process.env.GSN_PROFILE_FUNDING || '10';
  const profileFundingInWei = Web3.utils.toWei(profileFundingInPht);
  const relayHub = process.env.RELAY_HUB;

  // Factory is funded with 300 PHT and 20 PHT for every new profile created.
  // Therefore the total amount of pre-funded profiles will be of 300/20 = 15 profiles
  deployer.then(() => {
    return forceMigration('01')
    ? deployer.deploy(ProfileFactory, profileFundingInWei)
      : ProfileFactory.deployed();
  }).then((profileFactoryInstance) => {
    if (!forceMigration('01') && profileFactoryInstance) {
      console.log(`Contract already deployed ${profileFactoryInstance.address}. Skipped migration "01_deploy_gsn_profile_factory.js`);
      return;
    }

    return initializeProfileFactory(web3, {
      contractAddr: profileFactoryInstance.address,
      relayHub: relayHub,
      from: process.env.ACCOUNT,
      factoryFundingInPht: factoryFundingInPht,
      faucetFundingInPht: faucetFundingInPht
    });
  }).catch(err => {
    console.error(err);
    throw err;
  })
};
