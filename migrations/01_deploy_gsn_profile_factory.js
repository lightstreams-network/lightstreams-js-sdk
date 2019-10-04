const { deployGSNFactory } = require('../src/contracts/profile');

module.exports = function(deployer) {
  return deployGSNFactory(web3, {
    relayHub: process.env.RELAY_HUB,
    from: process.env.ACCOUNT,
    faucetFundingInPht: '300',
    fundingInPht: '20'
  });
};
