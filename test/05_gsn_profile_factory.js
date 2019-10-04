require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const { fundRecipient } = require('../src/gsn');
const { fromConnection } = require('@openzeppelin/network');
const { utils } = require('@openzeppelin/gsn-provider');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = utils;

const ProfileFactory = artifacts.require("GSNProfileFactory");
const Profile = artifacts.require("GSNProfile");

contract('GSNProfileFactory', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  const RELAY_HUB = process.env.RELAY_HUB;

  // Factory will be able to create 5 new individual Profiles
  const FACTORY_PROFILE_FAUCET_FUNDING_PHT = '90';
  const FACTORY_FUNDING_ETH = '20';

  let gsnCtx;
  let emptyAcc;
  let recoveryAcc;
  let factory;
  let newGSNProfile;
  let gasPrice;

  it('should deploy a profile factory', async () => {
    gasPrice = await web3.eth.getGasPrice();
    emptyAcc = await web3.eth.accounts.create("secret");
    recoveryAcc = await web3.eth.accounts.create("secret");

    factory = await ProfileFactory.new(FACTORY_FUNDING_ETH);

    console.log(`ProfileFactory addr: ${factory.address}`);
  });

  it('should initialize the GSN for ProfileFactory by configuring its RelayHub and funding it', async () => {
    let txHub = await factory.initialize(RELAY_HUB);
    assert.equal(txHub.receipt.status, true);

    let hubAddr = await factory.getHubAddr();
    assert.equal(hubAddr, RELAY_HUB);

    const factoryAddr = await factory.address;

    // Required so we can fund individual Profiles from ProfileFactory automatically
    const faucetTx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: factory.address,
      value: web3.utils.toWei(FACTORY_PROFILE_FAUCET_FUNDING_PHT, "ether")
    });
    assert.equal(faucetTx.status, true);

    // Required to register the Recipient in RelayHub
    const balance = await fundRecipient(web3, {
      recipient: factoryAddr,
      relayHub: RELAY_HUB,
      amountInPht: FACTORY_FUNDING_ETH,
      from: ROOT_ACCOUNT
    });

    assert.equal(balance, web3.utils.toWei(FACTORY_FUNDING_ETH, "ether"));
  });

  it('should deploy a Profile from a user without any funds for FREE using ProfileFactory', async () => {
    const isFactoryDeployed = await isRelayHubDeployedForRecipient(web3, factory.address);
    assert.equal(isFactoryDeployed, true);

    const factoryBalance = await getRecipientFunds(web3, factory.address);
    assert.equal(factoryBalance, web3.utils.toWei(FACTORY_FUNDING_ETH, "ether"));

    gsnCtx = await fromConnection(
      web3.eth.currentProvider.host, {
        gsn: {
          dev: false,
          signKey: emptyAcc.privateKey
        }
    });

    web3 = gsnCtx.lib;
    const factoryGSN = await new gsnCtx.lib.eth.Contract(factory.abi, factory.address);

    const createNewProfileRes = await factoryGSN.methods.newProfile(emptyAcc.address).send({
      from: emptyAcc.address,
      gasPrice: gasPrice,
      gasLimit: "7000000",
    });
    assert.equal(createNewProfileRes.status, true);

    const newProfileAddr = createNewProfileRes.events['NewProfile'].returnValues['addr'];

    const isProfileGSNReady = await isRelayHubDeployedForRecipient(web3, newProfileAddr);
    assert.equal(isProfileGSNReady, true);

    newGSNProfile = await new gsnCtx.lib.eth.Contract(Profile.abi, newProfileAddr);
    const isEmptyAccOwner = await newGSNProfile.methods.hasOwner(emptyAcc.address).call();

    await newGSNProfile.methods.addOwner(recoveryAcc.address).send({
      from: emptyAcc.address,
      gasPrice: gasPrice,
      gasLimit: "7000000",
    });
    const isRecoveryAccOwner = await newGSNProfile.methods.hasOwner(recoveryAcc.address).call();

    assert.equal(isEmptyAccOwner, true);
    assert.equal(isRecoveryAccOwner, true);
  });
});
