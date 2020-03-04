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
const FundingPool = artifacts.require("FundingPool");
const WPHT = artifacts.require("WPHT");

const Web3 = require('../src/web3');
const {
  buyArtistToken,
  transferIERC20Token,
  hatchArtistToken,
  refundArtistToken,
  claimArtistToken,
} = require('../src/contracts/profile');

const {
  allocateFunds,
} = require('../src/contracts/fundingPool');

const {
  getWPHTBalanceOf,
} = require('../src/contracts/wpht');

const {
  remainingHatchingAmount,
} = require('../migrations/03_deploy_artist_token');

const {
  getBalanceOf,
} = require('../src/contracts/artist_token');

// @IMPORTANT: Require redeploy migration `03_deploy_artist_token.js`
contract('ArtistToken', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;
  let FAN_ACCOUNT;
  const ACCOUNT_DEFAULT_PASSWORD = 'test123';
  let fanProfileInstance;

  const fanBuyAmountInPht = 10;

  it('should initialize fan contributor account', async () => {
    const txCost = 3;
    // Transfer little funds to recovery account to perform the claiming
    FAN_ACCOUNT = await web3.eth.personal.newAccount(ACCOUNT_DEFAULT_PASSWORD);
    await web3.eth.personal.unlockAccount(FAN_ACCOUNT, ACCOUNT_DEFAULT_PASSWORD, 1000);
    console.log(`Sending ${txCost} PHT to fan account`);
    await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: FAN_ACCOUNT,
      value: Web3.utils.toWei(`${txCost}`)
    });

    // New fan profile contract
    console.log(`Deploying a new profile contract for the fan`);
    fanProfileInstance = await Profile.new(FAN_ACCOUNT);

    // Transfer funds to profile contract
    console.log(`Sending ${fanBuyAmountInPht} PHT to fan contract`);
    await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: fanProfileInstance.address,
      value: Web3.utils.toWei(`${fanBuyAmountInPht + remainingHatchingAmount + txCost}`)
    });
  });

  // @IMPORTANT: Next test was tested by disabling the restriction over hatching time and it worked correctly
  // it('should hatch artist ArtistToken and request a refund', async () => {
  //   const artistTokenInstance = await ArtistToken.deployed();
  //   const wphtInstance = await WPHT.deployed();
  //   const smallHatchAmount = 1;
  //
  //   const profileBalanceBefore = await web3.eth.getBalance(fanProfileInstance.address);
  //   console.log(`Hatching ${remainingHatchingAmount} WPHT`);
  //   await hatchArtistToken(web3, {
  //     from: FAN_ACCOUNT,
  //     contractAddr: fanProfileInstance.address,
  //     artistTokenAddr: artistTokenInstance.address,
  //     amountInPht: smallHatchAmount
  //   });
  //
  //   await refundArtistToken(web3, {
  //     from: FAN_ACCOUNT,
  //     contractAddr: fanProfileInstance.address,
  //     artistTokenAddr: artistTokenInstance.address,
  //   });
  //
  //   const profileBalanceAfter = await web3.eth.getBalance(fanProfileInstance.address);
  //
  //   assert.equal(profileBalanceAfter, profileBalanceBefore);
  // });

  it('should complete ArtistToken hatching', async () => {
    const artistTokenInstance = await ArtistToken.deployed();
    const wphtInstance = await WPHT.deployed();

    assert.isFalse(await artistTokenInstance.isHatched());

    console.log(`Hatching ${remainingHatchingAmount} WPHT`);
    await hatchArtistToken(web3, {
      from: FAN_ACCOUNT,
      contractAddr: fanProfileInstance.address,
      artistTokenAddr: artistTokenInstance.address,
      wphtAddr: wphtInstance.address,
      amountInPht: fanBuyAmountInPht
    });

    assert.isTrue(await artistTokenInstance.isHatched());
  });

  it('should buy artist tokens using profile contract funds', async () => {
    const artistTokenInstance = await ArtistToken.deployed();

    console.log(`Buying ${fanBuyAmountInPht} artist tokens`);
    const bougthAmount = await buyArtistToken(web3, {
      from: FAN_ACCOUNT,
      contractAddr: fanProfileInstance.address,
      artistTokenAddr: artistTokenInstance.address,
      amountInPht: fanBuyAmountInPht
    });

    const balanceOfContract = await getBalanceOf(web3, {
      artistTokenAddr: artistTokenInstance.address,
      accountAddr: fanProfileInstance.address
    });

    assert.equal(bougthAmount, balanceOfContract);

    // Withdraw artist tokens back to user
    await transferIERC20Token(web3, {
      from: FAN_ACCOUNT,
      beneficiary: FAN_ACCOUNT,
      contractAddr: fanProfileInstance.address,
      amount: Web3.utils.toBN(balanceOfContract),
      tokenAddr: artistTokenInstance.address
    });

    const balanceOfUser = await getBalanceOf(web3, {
      artistTokenAddr: artistTokenInstance.address,
      accountAddr: FAN_ACCOUNT
    });

    assert.equal(bougthAmount, balanceOfUser);
  });

  it('should claim ArtistToken contributor hatch amount', async () => {
    const artistTokenInstance = await ArtistToken.deployed();

    console.log(`Claiming artist tokens...`);
    const claimedTotal = await claimArtistToken(web3, {
      from: FAN_ACCOUNT,
      contractAddr: fanProfileInstance.address,
      artistTokenAddr: artistTokenInstance.address,
    });

    const balanceOfContract = await getBalanceOf(web3, {
      artistTokenAddr: artistTokenInstance.address,
      accountAddr: fanProfileInstance.address
    });

    assert.equal(claimedTotal, balanceOfContract);
  });

  it('should claim accumulated WPHT from hatching', async () => {
    const wphtInstance = await WPHT.deployed();
    const artistTokenInstance = await ArtistToken.deployed();
    const fundingPoolInstance = await FundingPool.deployed();
    // We are using fan profile contract as beneficiary because it is the only profile deployed
    // within the scope of this test
    const beneficiaryAddr = fanProfileInstance.address;

    const fundingPoolWPHTBalanceInWei = await getWPHTBalanceOf(web3, {
      wphtAddr: wphtInstance.address,
      accountAddr: fundingPoolInstance.address,
    });

    const beforeWPHTBalanceInWei = await getWPHTBalanceOf(web3, {
      wphtAddr: wphtInstance.address,
      accountAddr: beneficiaryAddr,
    });

    console.log(`Claiming ${Web3.utils.toPht(fundingPoolWPHTBalanceInWei)} WPHT from hatching of artist tokens...`);
    await allocateFunds(web3, {
      from: ROOT_ACCOUNT,
      contractAddr: fundingPoolInstance.address,
      artistTokenAddr: artistTokenInstance.address,
      beneficiary: beneficiaryAddr,
      amount: fundingPoolWPHTBalanceInWei
    });

    const afterWPHTBalanceInWei = await getWPHTBalanceOf(web3, {
      wphtAddr: wphtInstance.address,
      accountAddr: beneficiaryAddr,
    });

    assert.equal(afterWPHTBalanceInWei.toString(), beforeWPHTBalanceInWei.add(fundingPoolWPHTBalanceInWei).toString());
  });

  it('should pull WPHT from holded by profile contract', async () => {
    const wphtInstance = await WPHT.deployed();
    const beneficiaryAddr = ROOT_ACCOUNT;

    const profileWPHTBalanceInWei = await getWPHTBalanceOf(web3, {
      wphtAddr: wphtInstance.address,
      accountAddr: fanProfileInstance.address,
    });

    const beforeWPHTBalanceInWei = await getWPHTBalanceOf(web3, {
      wphtAddr: wphtInstance.address,
      accountAddr: beneficiaryAddr,
    });

    // Withdraw artist tokens back to user
    await transferIERC20Token(web3, {
      from: FAN_ACCOUNT,
      beneficiary: beneficiaryAddr,
      contractAddr: fanProfileInstance.address,
      amount: profileWPHTBalanceInWei,
      tokenAddr: wphtInstance.address
    });

    const afterWPHTBalanceInWei = await getWPHTBalanceOf(web3, {
      wphtAddr: wphtInstance.address,
      accountAddr: beneficiaryAddr,
    });

    assert.equal(afterWPHTBalanceInWei.toString(), beforeWPHTBalanceInWei.add(profileWPHTBalanceInWei).toString());
  });

});
