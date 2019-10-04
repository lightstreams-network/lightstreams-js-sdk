const { deployGSNFactory } = require('../src/contracts/profile');

module.exports = function(deployer) {
  // Factory is funded with 300 PHT and 20 PHT for every new profile created.
  // Therefore the total amount of pre-funded profiles will be of 300/20 = 15 profiles
  return deployGSNFactory(web3, {
    relayHub: process.env.RELAY_HUB,
    from: process.env.ACCOUNT,
    factoryFundingInPht: '300',
    profileFundingInPht: '20'
  });
};
