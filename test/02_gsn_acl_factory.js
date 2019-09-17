require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const { fundRecipient } = require('@openzeppelin/gsn-helpers');
const { fromConnection, useEphemeralKey } = require('@openzeppelin/network');
const { utils } = require('@openzeppelin/gsn-provider');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = utils;

const ACLFactory = artifacts.require("GSNAclFactory");
const ACL = artifacts.require("GSNAcl");

contract('AclFactory', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  const RELAY_HUB = process.env.RELAYHUB;
  // Factory will be able to create 5 new individual ACLs

  const FACTORY_ACL_FAUCET_FUNDING_ETH = '50';
  const FACTORY_FUNDING_ETH = '8';

  let gsnCtx;
  let emptyAcc;
  let readerAcc;
  let factory;
  let newACLGSN;
  let gasPrice;

  it('should deploy a factory', async () => {
    factory = await ACLFactory.new();

    gasPrice = await web3.eth.getGasPrice();
    emptyAcc = await web3.eth.accounts.create("secret");
    readerAcc = await web3.eth.accounts.create("secret");
  });

  it('should initialize the GSN for ACLFactory by configuring its RelayHub and funding it', async () => {
    let txHub = await factory.initialize(RELAY_HUB);
    assert.equal(txHub.receipt.status, true);

    let hubAddr = await factory.getHubAddr();
    assert.equal(hubAddr, RELAY_HUB);

    const factoryAddr = await factory.address;

    // Required so we can fund individual ACLs from ACLFactory automatically
    const faucetTx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: factory.address,
      value: web3.utils.toWei(FACTORY_ACL_FAUCET_FUNDING_ETH, "ether")
    });
    assert.equal(faucetTx.status, true);

    // Required to register the Recipient in RelayHub
    const balance = await fundRecipient(web3, {
      recipient: factoryAddr,
      relayHubAddress: RELAY_HUB,
      amount: web3.utils.toWei(FACTORY_FUNDING_ETH, "ether"),
      from: ROOT_ACCOUNT
    });

    assert.equal(balance, web3.utils.toWei(FACTORY_FUNDING_ETH, "ether"));
  });

  it('should deploy an ACL from a user without any funds for FREE using ACLFactory', async () => {
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

    const createNewACLRes = await factoryGSN.methods.newACL(emptyAcc.address).send({
      from: emptyAcc.address,
      gasPrice: gasPrice,
      gasLimit: "7000000",
    });
    assert.equal(createNewACLRes.status, true);

    const newACLAddr = createNewACLRes.events['NewACL'].returnValues['addr'];

    const isACLGSNReady = await isRelayHubDeployedForRecipient(web3, newACLAddr);
    assert.equal(isACLGSNReady, true);

    newACLGSN = await new gsnCtx.lib.eth.Contract(ACL.abi, newACLAddr);
    const aclOwner = await newACLGSN.methods.getOwner().call();

    const isACLOwnerAdmin = await newACLGSN.methods.hasAdmin(emptyAcc.address).call();

    assert.equal(aclOwner, emptyAcc.address);
    assert.equal(isACLOwnerAdmin, true);
  });

  it('should be possible for ACL owner, to control permissions (grandRead, etc) without any funds, for FREE', async () => {
    let hasReadAccess = await newACLGSN.methods.hasRead(readerAcc.address).call();
    assert.equal(hasReadAccess, false);

    const grantReadRes = await newACLGSN.methods.grantRead(readerAcc.address).send({
      from: emptyAcc.address,
      gasPrice: gasPrice,
      gasLimit: "7000000",
    });
    assert.equal(grantReadRes.status, true);

    hasReadAccess = await newACLGSN.methods.hasRead(readerAcc.address).call();
    assert.equal(hasReadAccess, true);
  });
});
