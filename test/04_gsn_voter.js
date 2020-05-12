require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const { fundRecipient, newWeb3Engine } = require('../src/gsn');
const { utils } = require('@openzeppelin/gsn-provider');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = utils;

const Web3 = require('../src/web3');
const Voter = artifacts.require("Voter");

contract('Voter', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  const RELAY_HUB = process.env.RELAY_HUB;

  let voter;

  it('should deploy Voter', async () => {
    voter = await Voter.new();
  });

  it('should initialize the GSN for Voter by configuring its RelayHub and funding it', async () => {
    let txHub = await voter.initialize(RELAY_HUB);
    assert.equal(txHub.receipt.status, true);

    let hubAddr = await voter.getHubAddr();
    assert.equal(hubAddr, RELAY_HUB);

    const voterAddr = await voter.address;
    console.log("voterAddr", voterAddr)

    // Register the Recipient in RelayHub
    const voterFundingPHTs = "10";
    const balance = await fundRecipient(web3, {
      recipient: voterAddr,
      relayHub: RELAY_HUB,
      amountInPht: voterFundingPHTs,
      from: ROOT_ACCOUNT
    });

    assert.equal(balance, Web3.utils.toWei(voterFundingPHTs, "ether"));
  });

  it('should execute upVote TX for FREE from a user without any funds', async () => {
    const isVoterReady = await isRelayHubDeployedForRecipient(web3, voter.address);
    assert.equal(isVoterReady, true);

    console.log("web3.eth.currentProvider.host", web3.eth.currentProvider.host)
    web3gsn = await Web3.newEngine(web3.eth.currentProvider.host);

    emptyAccAddr = await web3gsn.eth.personal.newAccount("secret");

    const tx = await Web3.contractSendTx(web3gsn, {
      from: emptyAccAddr,
      to: voter.address,
      abi: voter.abi,
      method: 'upVote',
      useGSN: true,
    });

    assert.equal(tx.status, true);
    const lastVoter = tx.events['Voted'].returnValues['account'];
    const newCount = tx.events['Voted'].returnValues['newCount'];

    assert.equal(lastVoter, emptyAccAddr);
    assert.equal(newCount, 1);
  });
});
