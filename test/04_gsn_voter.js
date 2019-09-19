require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const { fundRecipient } = require('@openzeppelin/gsn-helpers');
const { fromConnection } = require('@openzeppelin/network');
const { utils } = require('@openzeppelin/gsn-provider');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = utils;

const Voter = artifacts.require("Voter");

// TODO: Move the file to examples.
contract('Voter', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  const RELAY_HUB = process.env.RELAYHUB;

  let gsnCtx;
  let emptyAcc;
  let gasPrice;
  let voter;

  it('should deploy Voter', async () => {
    voter = await Voter.new();

    gasPrice = await web3.eth.getGasPrice();
    emptyAcc = await web3.eth.accounts.create("secret");
  });

  it('should initialize the GSN for Voter by configuring its RelayHub and funding it', async () => {
    let txHub = await voter.initialize(RELAY_HUB);
    assert.equal(txHub.receipt.status, true);

    let hubAddr = await voter.getHubAddr();
    assert.equal(hubAddr, RELAY_HUB);

    const voterAddr = await voter.address;

    // Register the Recipient in RelayHub
    const voterFundingPHTs = "10";
    const balance = await fundRecipient(web3, {
      recipient: voterAddr,
      relayHubAddress: RELAY_HUB,
      amount: web3.utils.toWei(voterFundingPHTs, "ether"),
      from: ROOT_ACCOUNT
    });

    assert.equal(balance, web3.utils.toWei(voterFundingPHTs, "ether"));
  });

  it('should execute upVote TX for FREE from a user without any funds', async () => {
    const isVoterReady = await isRelayHubDeployedForRecipient(web3, voter.address);
    assert.equal(isVoterReady, true);

    gsnCtx = await fromConnection(
      web3.eth.currentProvider.host, {
        gsn: {
          dev: false,
          signKey: emptyAcc.privateKey
        }
    });

    web3 = gsnCtx.lib;
    const voterGSN = await new gsnCtx.lib.eth.Contract(voter.abi, voter.address);

    const tx = await voterGSN.methods.upVote().send({
      from: emptyAcc.address,
      gasPrice: gasPrice,
      gasLimit: "1000000",
    });
    assert.equal(tx.status, true);

    const lastVoter = tx.events['Voted'].returnValues['account'];
    const newCount = tx.events['Voted'].returnValues['newCount'];

    assert.equal(lastVoter, emptyAcc.address);
    assert.equal(newCount, 1);
  });
});
