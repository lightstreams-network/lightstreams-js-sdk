const { initializeProfileFactory } = require('../src/contracts/profile');
const Web3 = require('../src/web3');

const ProfileFactory = artifacts.require("GSNProfileFactory");

module.exports = function(deployer) {
  const profileFundingInPht = process.env.GSN_PROFILE_FUNDING || '20';
  const factoryFundingInPht = process.env.GSN_PROFILE_FACTORY_FUNDING || '300';
  const profileFundingInWei = Web3.utils.toWei(profileFundingInPht);
  const relayHub = process.env.RELAY_HUB;

  // Factory is funded with 300 PHT and 20 PHT for every new profile created.
  // Therefore the total amount of pre-funded profiles will be of 300/20 = 15 profiles
  deployer.deploy(ProfileFactory, profileFundingInWei).then(instance => {
    return initializeProfileFactory(web3, {
      contractAddr: instance.address,
      relayHub: relayHub,
      from: process.env.ACCOUNT,
      factoryFundingInPht: factoryFundingInPht,
      profileFundingInPht: profileFundingInPht
    });
  });
};
