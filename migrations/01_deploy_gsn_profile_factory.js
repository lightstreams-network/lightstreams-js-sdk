const ProfileFactorySc = artifacts.require("GSNProfileFactory");
const { fundRecipient } = require('@openzeppelin/gsn-helpers');

module.exports = function(deployer) {
  const RELAY_HUB = `${process.env.RELAY_HUB}`;

  let profileFactory;

  deployer.deploy(ProfileFactorySc)
    .then((instance) => {
      console.log(`GSNProfileFactory.sol successfully deployed at ${instance.address}!`);

      profileFactory = instance;
    })
    .then(() => {
      console.log(`Activating GSN for ProfileFactory instance for RelayHub ${RELAY_HUB}...`);

      return profileFactory.initialize(RELAY_HUB);
    })
    .then(() => {
      const funds = "50";
      console.log(`Funding GSN ProfileFactory ${profileFactory.address} with ${funds}PHTs...`);

      return fundRecipient(web3, {
        recipient: profileFactory.address,
        relayHubAddress: RELAY_HUB,
        amount: web3.utils.toWei(funds, "ether")
      });
    })
}
