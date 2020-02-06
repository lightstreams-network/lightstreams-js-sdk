/**
 * User: ggarrido
 * Date: 26/08/19 16:11
 * Copyright 2019 (c) Lightstreams, Granada
 */

require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const Profile = artifacts.require("GSNProfile");
const ArtistToken = artifacts.require("ArtistToken");
const WPHT = artifacts.require("WPHT");
const ACL = artifacts.require("ACL");

const Web3 = require('../src/web3');
const {
  buyArtistTokens
} = require('../src/contracts/profile');

const {
  getBalanceOf
} = require('../src/contracts/artist_token');

contract('Profile', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  let RECOVERY_ACCOUNT;
  let FAN_ACCOUNT;
  const ACCOUNT_DEFAULT_PASSWORD = 'test123';
  let profileInstance;

  it('should buy artist tokens using profile contract funds', async () => {
    const amountInPht = 10;
    const txCost = 2;
    const artistTokenInstance = ArtistToken.deployed();
    const wphtInstance = WPHT.deployed();

    // Transfer little funds to recovery account to perform the claiming
    FAN_ACCOUNT = await web3.eth.personal.newAccount(ACCOUNT_DEFAULT_PASSWORD);
    await web3.eth.sendTransaction({
      from: FAN_ACCOUNT,
      to: profileInstance.address,
      value: Web3.utils.toWei(`${txCost}`)
    });

    // New fan profile contract
    const fanProfileInstance = await Profile.new(FAN_ACCOUNT);

    // Transfer funds to profile contract
    await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: profileInstance.address,
      value: Web3.utils.toWei(`${amountInPht}`)
    });

    const bougthAmount = await buyArtistTokens(web3, {
      contractAddr: fanProfileInstance.address,
      artistTokenAddr: artistTokenInstance.address,
      wphtAddr: wphtInstance.address,
      from: RECOVERY_ACCOUNT,
      amountInPht
    });

    const balanceOf = await getBalanceOf(web3, {
      artistTokenAddr: artistTokenInstance.address,
      accountAddr: profileInstance.address
    });

    assert.equal(bougthAmount, balanceOf);
  });

  // it('should deploy a multi ownable GSN Profile contract', async () => {
  //   const instanceProfile = await Profile.new(ROOT_ACCOUNT);
  //
  //   const isOwner = await instanceProfile.hasOwner(ROOT_ACCOUNT);
  //   assert.equal(isOwner, true, "message sender is correctly inserted as contract owner");
  // });
  //
  // it('should deploy a multi ownable GSN Profile contract, with recovery account', async () => {
  //   RECOVERY_ACCOUNT = await web3.eth.personal.newAccount(ACCOUNT_DEFAULT_PASSWORD);
  //
  //   const instanceProfile = await Profile.new(ROOT_ACCOUNT);
  //   await instanceProfile.addOwner(RECOVERY_ACCOUNT);
  //
  //   const isOwner = await instanceProfile.hasOwner(ROOT_ACCOUNT);
  //   assert.equal(isOwner, true, "message sender is correctly inserted as contract owner");
  //
  //   const isRecoveryAccountOwner = await instanceProfile.hasOwner(RECOVERY_ACCOUNT);
  //   assert.equal(isRecoveryAccountOwner, true, "recovery account is correctly inserted as contract owner");
  //
  //   profileInstance = instanceProfile;
  // });
  //
  // it('should deploy an ACL and add a file to the GSN Profile', async () => {
  //   const instanceAcl = await ACL.new(ROOT_ACCOUNT, false);
  //   const ipfsHashHex = web3.utils.asciiToHex('QmVkoUR7okDxVtoX');
  //   const ipfsHashBytes = web3.utils.hexToBytes(ipfsHashHex);
  //
  //   await instanceAcl.grantAdmin(profileInstance.address);
  //   await profileInstance.addFile(ipfsHashBytes, instanceAcl.address);
  //
  //   const hasFile = await profileInstance.hasFile(ipfsHashBytes);
  //   assert.equal(hasFile, true, "file was added correctly to profile");
  // });
});
