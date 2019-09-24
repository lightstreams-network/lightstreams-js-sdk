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
const ACL = artifacts.require("Acl");

contract('Profile', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  let RECOVERY_ACCOUNT;
  const RECOVERY_ACCOUNT_PASSWORD = 'recovery86!';
  let profileInstance;

  it('should deploy a multi ownable GSN Profile contract', async () => {
    const instanceProfile = await Profile.new(ROOT_ACCOUNT);

    const isOwner = await instanceProfile.hasOwner(ROOT_ACCOUNT);
    assert.equal(isOwner, true, "message sender is correctly inserted as contract owner");
  });

  it('should deploy a multi ownable GSN Profile contract, with recovery account', async () => {
    RECOVERY_ACCOUNT = await web3.eth.personal.newAccount(RECOVERY_ACCOUNT_PASSWORD);

    const instanceProfile = await Profile.new(ROOT_ACCOUNT);
    await instanceProfile.addOwner(RECOVERY_ACCOUNT);

    const isOwner = await instanceProfile.hasOwner(ROOT_ACCOUNT);
    assert.equal(isOwner, true, "message sender is correctly inserted as contract owner");

    const isRecoveryAccountOwner = await instanceProfile.hasOwner(RECOVERY_ACCOUNT);
    assert.equal(isRecoveryAccountOwner, true, "recovery account is correctly inserted as contract owner");

    profileInstance = instanceProfile;
  });

  it('should deploy an ACL and add a file to the GSN Profile', async () => {
    const instanceAcl = await ACL.new(ROOT_ACCOUNT, false);
    const ipfsHashHex = web3.utils.asciiToHex('QmVkoUR7okDxVtoX');
    const ipfsHashBytes = web3.utils.hexToBytes(ipfsHashHex);

    await instanceAcl.grantAdmin(profileInstance.address);
    await profileInstance.addFile(ipfsHashBytes, instanceAcl.address);

    const hasFile = await profileInstance.hasFile(ipfsHashBytes);
    assert.equal(hasFile, true, "file was added correctly to profile");
  });
});
