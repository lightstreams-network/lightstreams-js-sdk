const ProfileFactorySc = artifacts.require("GSNProfileFactory");
const { fundRecipient } = require('@openzeppelin/gsn-helpers');

module.exports = function(deployer) {
  const RELAY_HUB = `${process.env.RELAY_HUB}`;
  const ROOT_ACCOUNT = `${process.env.ACCOUNT}`;

  // Factory will be able to create 5 new individual Profiles
  const FACTORY_PROFILE_FAUCET_FUNDING_PHT = '90';
  const FACTORY_FUNDING_ETH = '20';

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
      console.log(`Topping up ProfileFactory with ${FACTORY_PROFILE_FAUCET_FUNDING_PHT}PHTs...`);

      return web3.eth.sendTransaction({
        from: ROOT_ACCOUNT,
        to: profileFactory.address,
        value: web3.utils.toWei(FACTORY_PROFILE_FAUCET_FUNDING_PHT, "ether")
      });
    })
    .then(() => {
      console.log(`Funding GSN ProfileFactory ${profileFactory.address} with ${FACTORY_FUNDING_ETH}PHTs...`);

      return fundRecipient(web3, {
        recipient: profileFactory.address,
        relayHubAddress: RELAY_HUB,
        amount: web3.utils.toWei(FACTORY_FUNDING_ETH, "ether")
      });
    })
}
