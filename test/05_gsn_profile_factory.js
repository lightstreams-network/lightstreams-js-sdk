require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const {
  fundRecipient,
  getRecipientFunds,
  newWeb3Engine,
  isRelayHubDeployedForRecipient
} = require('../src/gsn');

const Web3 = require('../src/web3');
const Web3Provider = require('../src/web3-provider');

const ProfileFactory = artifacts.require("GSNProfileFactory");
const Profile = artifacts.require("GSNProfile");

contract('GSNProfileFactory', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  const RELAY_HUB = process.env.RELAY_HUB;

  // Factory will be able to create 5 new individual Profiles
  const FACTORY_PROFILE_FAUCET_FUNDING_PHT = process.env.GSN_PROFILE_FACTORY_FUNDING;
  const FACTORY_FUNDING_ETH = process.env.GSN_PROFILE_FUNDING;

  let emptyAccAddr;
  let recoveryAccAddr;
  let factory;
  let gasPrice;

  it('should deploy a profile factory', async () => {
    gasPrice = await web3.eth.getGasPrice();

    factory = await ProfileFactory.new(Web3.utils.toWei(FACTORY_FUNDING_ETH));

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
      value: Web3.utils.toWei(FACTORY_PROFILE_FAUCET_FUNDING_PHT)
    });
    assert.equal(faucetTx.status, true);

    // Required to register the Recipient in RelayHub
    await fundRecipient(web3, {
      recipient: factoryAddr,
      relayHub: RELAY_HUB,
      amountInPht: FACTORY_FUNDING_ETH,
      from: ROOT_ACCOUNT
    });

    const balance = await getRecipientFunds(web3, { recipient: factoryAddr, });

    assert.equal(balance, Web3.utils.toWei(FACTORY_FUNDING_ETH, "ether"));
  });

  it('should deploy a Profile from a user without any funds for FREE using ProfileFactory', async () => {
    const web3ls = await Web3.newEngine(Web3Provider({
      rpcUrl: web3.eth.currentProvider.host,
      useGSN: false, // Use true in case you want GSN by default
      verbose: false
    }));

    emptyAccAddr = await web3ls.eth.personal.newAccount("secret");
    recoveryAccAddr = await web3ls.eth.personal.newAccount("secret");

    const isFactoryDeployed = await isRelayHubDeployedForRecipient(web3ls, { recipient: factory.address });
    assert.equal(isFactoryDeployed, true);

    const factoryBalance = await getRecipientFunds(web3ls, { recipient: factory.address });
    assert.equal(factoryBalance, Web3.utils.toWei(FACTORY_FUNDING_ETH, "ether"));

    const factoryGSN = await new web3ls.eth.Contract(factory.abi, factory.address);
    const createNewProfileRes = await factoryGSN.methods.newProfile(emptyAccAddr).send({
      from: emptyAccAddr,
      gasPrice: gasPrice,
      gasLimit: "7000000",
      useGSN: true,
    });
    assert.equal(createNewProfileRes.status, true);

    const newProfileAddr = createNewProfileRes.events['NewProfile'].returnValues['addr'];

    const isProfileGSNReady = await isRelayHubDeployedForRecipient(web3ls, { recipient: newProfileAddr });
    assert.equal(isProfileGSNReady, true);

    const txReceipt = await Web3.contractSendTx(web3ls, {
      to: newProfileAddr,
      abi: Profile.abi,
      from: emptyAccAddr,
      method: 'addOwner',
      useGSN: true,
      params: [recoveryAccAddr]
    });
    assert.equal(txReceipt.status, true);

    const isRecoveryAccOwner = await Web3.contractCall(web3ls, {
      to: newProfileAddr,
      abi: Profile.abi,
      method: 'hasOwner',
      params: [recoveryAccAddr]
    });
    assert.equal(isRecoveryAccOwner, true);
  });
});
