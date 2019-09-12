require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const { fundRecipient } = require('@openzeppelin/gsn-helpers');
const { fromConnection, useEphemeralKey } = require('@openzeppelin/network');
const { utils } = require('@openzeppelin/gsn-provider');
const { isRelayHubDeployedForRecipient, getRecipientFunds } = utils;

const ACLFactory = artifacts.require("AclFactory");
const ACL = artifacts.require("Acl");

contract('AclFactory', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  const RELAY_HUB = process.env.RELAYHUB;
  const FACTORY_FUNDING_ETH = '3';
  const ACL_FUNDING_ETH = '1';

  it('check receipt', async () => {
    let receipt = await web3.eth.getTransactionReceipt("0x07c2076a3a1d7294335cb68a0c3abc89edf39c202fac6107c445c5b410eb61a6");
    console.log(receipt);
  });
});
