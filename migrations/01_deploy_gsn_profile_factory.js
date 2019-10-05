const { deployProfileFactory } = require('../src/contracts/profile');

module.exports = function(deployer) {
  // Factory is funded with 300 PHT and 20 PHT for every new profile created.
  // Therefore the total amount of pre-funded profiles will be of 300/20 = 15 profiles
  return deployProfileFactory(web3, {
    relayHub: process.env.RELAY_HUB,
    from: process.env.ACCOUNT,
    factoryFundingInPht: process.env.GSN_PROFILE_FACTORY_FUNDING || '300',
    profileFundingInPht: process.env.GSN_PROFILE_FUNDING || '20'
  });

};
