require('dotenv').config({ path: `${__dirname}/.env` });

const { BN, shouldFail, ether } = require('openzeppelin-test-helpers');
const { panic } = require('./utils');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const ArtistTokenSc = artifacts.require("ArtistToken");
const WPHTSc = artifacts.require("WPHT");
const FundingPoolSc = artifacts.require("FundingPool");

const pht2wei = (value) => {
  return ether(value.toString());
};

function wei2pht (n) {
  return web3.utils.fromWei(n, 'ether');
}

const {
  isArtistTokenHatched,
  hatchArtistToken,
  getArtistTokenTotalSupply,
  buyArtistTokens,
  sellArtistTokens,
  getArtistTokenBalanceOf,
} = require('../src/contracts/artist_token');

const {
  getWPHTBalanceOf
} = require('../src/contracts/wpht');

contract('ArtistToken', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;

  const TX_COST_BUFFER_PHT = 20;
  const INIT_HATCHER_WPHT_BALANCE_PHT = 20000;
  const BUYER_WPHT_PURCHASE_COST_PHT = 1000;
  const AMOUNT_TO_RAISE_PHT = 10000;
  const PER_HATCHER_CONTRIBUTION_PHT = AMOUNT_TO_RAISE_PHT / 2;
  const MIN_REQUIRED_HATCHER_CONTRIBUTION_PHT = 100;
  const EXCEEDED_AMOUNT_TO_RAISE_PHT = AMOUNT_TO_RAISE_PHT + 1;
  const INSUFFICIENT_AMOUNT_TO_RAISE_PHT = AMOUNT_TO_RAISE_PHT / 100;
  const INSUFFICIENT_CONTRIBUTION_PHT = MIN_REQUIRED_HATCHER_CONTRIBUTION_PHT - 1;

  const PER_HATCHER_CONTRIBUTION_WEI = pht2wei(PER_HATCHER_CONTRIBUTION_PHT);
  const BUYER_WPHT_PURCHASE_COST_WEI = pht2wei(BUYER_WPHT_PURCHASE_COST_PHT);
  const INIT_HATCHER_WPHT_BALANCE_WEI = pht2wei(INIT_HATCHER_WPHT_BALANCE_PHT);
  const AMOUNT_TO_RAISE_WEI = pht2wei(AMOUNT_TO_RAISE_PHT);
  const MIN_REQUIRED_HATCHER_CONTRIBUTION_WEI = pht2wei(MIN_REQUIRED_HATCHER_CONTRIBUTION_PHT);
  const EXCEEDED_AMOUNT_TO_RAISE_WEI = pht2wei(EXCEEDED_AMOUNT_TO_RAISE_PHT);
  const INSUFFICIENT_AMOUNT_TO_RAISE_WEI = pht2wei(INSUFFICIENT_AMOUNT_TO_RAISE_PHT);
  const INSUFFICIENT_CONTRIBUTION_WEI = pht2wei(INSUFFICIENT_CONTRIBUTION_PHT);

  const RESERVE_RATIO = 142857; // kappa ~ 6
  const THETA = 350000; // 35% in ppm
  const P0 =  1; // price to purchase during hatching
  const FRICTION = 20000; // 2% in ppm
  const GAS_PRICE_WEI = 500000000000; // 500 gwei
  const DENOMINATOR_PPM = 1000000;
  const HATCH_DURATION_SECONDS = 3024000; // 5 weeks
  const HATCH_VESTING_DURATION_SECONDS = 0; // 0 seconds

  const ARTIST_NAME = 'Armin Van Lightstreams';
  const ARTIST_SYMBOL = 'AVL';

  let artist = ROOT_ACCOUNT;
  let hatcher1;
  let hatcher2;
  let buyer1;
  let buyer2;
  let feeRecipient;
  let lightstreams;
  let fundingPoolAttacker;
  let fundingPoolAccountant;

  let artistToken;
  let fundingPool;
  let wPHT;
  let artistTokenSymbol;
  let postBuyer1ArtistTokensBalance;

  it('should create required accounts and fund them with PHTs', async () => {
    const accPwd = "secret";
    hatcher1 = await web3.eth.personal.newAccount(accPwd);
    hatcher2 = await web3.eth.personal.newAccount(accPwd);
    buyer1 = await web3.eth.personal.newAccount(accPwd);
    buyer2 = await web3.eth.personal.newAccount(accPwd);
    feeRecipient = await web3.eth.personal.newAccount(accPwd);
    lightstreams = await web3.eth.personal.newAccount(accPwd);
    fundingPoolAttacker = await web3.eth.personal.newAccount(accPwd);
    fundingPoolAccountant = await web3.eth.personal.newAccount(accPwd);

    await web3.eth.personal.unlockAccount(hatcher1, accPwd, 1000);
    await web3.eth.personal.unlockAccount(hatcher2, accPwd, 1000);
    await web3.eth.personal.unlockAccount(buyer1, accPwd, 1000);
    await web3.eth.personal.unlockAccount(buyer2, accPwd, 1000);
    await web3.eth.personal.unlockAccount(feeRecipient, accPwd, 1000);
    await web3.eth.personal.unlockAccount(lightstreams, accPwd, 1000);
    await web3.eth.personal.unlockAccount(fundingPoolAttacker, accPwd, 1000);
    await web3.eth.personal.unlockAccount(fundingPoolAccountant, accPwd, 1000);

    console.log(`Hatcher1 account ${hatcher1} created.`);
    console.log(`Hatcher2 account ${hatcher2} created.`);
    console.log(`Buyer1 account ${buyer1} created.`);
    console.log(`Buyer2 account ${buyer2} created.`);
    console.log(`FeeRecipient account ${feeRecipient} created.`);
    console.log(`Lightstreams account ${lightstreams} created.`);
    console.log(`FundingPoolAttacker account ${fundingPoolAttacker} created.`);
    console.log(`FundingPoolAccountant account ${fundingPoolAccountant} created.`);

    let tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: hatcher1,
      value: pht2wei(INIT_HATCHER_WPHT_BALANCE_PHT + TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);

    tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: hatcher2,
      value: pht2wei(INIT_HATCHER_WPHT_BALANCE_PHT + TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);

    tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: buyer1,
      value: pht2wei(BUYER_WPHT_PURCHASE_COST_PHT + TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);

    tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: buyer2,
      value: pht2wei(BUYER_WPHT_PURCHASE_COST_PHT + TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);

    tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: lightstreams,
      value: pht2wei(TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);

    tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: fundingPoolAttacker,
      value: pht2wei(TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);

    tx = await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: fundingPoolAccountant,
      value: pht2wei(TX_COST_BUFFER_PHT)
    });
    assert.equal(tx.status, true);
  });

  it('should deploy a FundingPool', async () => {
    fundingPool = await FundingPoolSc.new();

    console.log(`FundingPool addr: ${fundingPool.address}`);
  });

  it('should deploy a WPHT', async () => {
    wPHT = await WPHTSc.new();

    console.log(`WPHT addr: ${wPHT.address}`);
  });

  it('should deploy a ArtistToken', async () => {
    artistToken = await ArtistTokenSc.new(
      ARTIST_NAME,
      ARTIST_SYMBOL,
      [wPHT.address, fundingPool.address, feeRecipient, lightstreams],
      [GAS_PRICE_WEI, THETA, P0, AMOUNT_TO_RAISE_WEI, FRICTION, HATCH_DURATION_SECONDS, HATCH_VESTING_DURATION_SECONDS, MIN_REQUIRED_HATCHER_CONTRIBUTION_WEI],
      RESERVE_RATIO,
      { from: artist, gas: 10000000 }
    );

    artistTokenSymbol = await artistToken.symbol.call();

    console.log(`ArtistToken addr: ${artistToken.address}`);
  });

  it('should not be paused', async () => {
    const isPaused = await artistToken.paused();

    assert.isFalse(isPaused);
  });

  it('should have configured Lightstreams as a pauser', async () => {
    const isArtistPauser = await artistToken.isPauser(artist);
    const isLightstreamsPauser = await artistToken.isPauser(lightstreams);

    assert.isFalse(isArtistPauser);
    assert.isTrue(isLightstreamsPauser);
  });

  it("should have Hatchers with positive wPHT(PHT20) balances ready", async () => {
    await wPHT.deposit({
      from: hatcher1,
      value: PER_HATCHER_CONTRIBUTION_WEI
    });

    await wPHT.deposit({
      from: hatcher2,
      value: PER_HATCHER_CONTRIBUTION_WEI
    });

    const hatcher1WPHTBalance = await getWPHTBalanceOf(web3, { wphtAddr: wPHT.address, accountAddr: hatcher1 });
    const hatcher2WPHTBalance = await getWPHTBalanceOf(web3, { wphtAddr: wPHT.address, accountAddr: hatcher2 });

    assert.equal(hatcher1WPHTBalance.toString(), PER_HATCHER_CONTRIBUTION_WEI.toString());
    assert.equal(hatcher2WPHTBalance.toString(), PER_HATCHER_CONTRIBUTION_WEI.toString());
  });

  it("should be in a 'hatching phase' after deployed", async () => {
    const isHatched = await isArtistTokenHatched(web3, { artistTokenAddr: artistToken.address });

    assert.isFalse(isHatched);
  });

  it('should be possible to pause and un-pause the economy', async () => {
    await artistToken.pause({ from: lightstreams });
    assert.isTrue(await artistToken.paused());

    await artistToken.unpause({ from: lightstreams });
    assert.isFalse(await artistToken.paused());
  });

  it('should end the hatching phase by contributing configured minimum amount to raise from 2 hatchers', async () => {
    try {
      await hatchArtistToken(
        web3,
        {
          from: hatcher1,
          artistTokenAddr: artistToken.address,
          wphtAddr: wPHT.address,
          amountWeiBn: PER_HATCHER_CONTRIBUTION_WEI
        }
      );

      console.log(`Hatcher1 contributed: ${wei2pht(PER_HATCHER_CONTRIBUTION_WEI)} WPHT`);

      let isHatched = await artistToken.isHatched();
      assert.isFalse(isHatched);
    } catch (e) {
      panic(e);
    }

    try {
      await hatchArtistToken(
        web3,
        {
          from: hatcher2,
          artistTokenAddr: artistToken.address,
          wphtAddr: wPHT.address,
          amountWeiBn: PER_HATCHER_CONTRIBUTION_WEI
        }
      );
      console.log(`Hatcher1 contributed: ${wei2pht(PER_HATCHER_CONTRIBUTION_WEI)} WPHT`);

      let isHatched = await artistToken.isHatched();
      assert.isTrue(isHatched);
    } catch (e) {
      panic(e);
    }
  });

  it('should query WPHT and ensure ArtistToken has received the raised amount in WPHTs', async () => {
    const raisedWPHTs = await artistToken.raisedExternal();

    assert.equal(raisedWPHTs.toString(), AMOUNT_TO_RAISE_WEI.toString());
  });

  it('should query WPHT and ensure ArtistToken has received the raised amount in WPHTs minus protocol thetas', async () => {
    const poolBalance = await artistToken.poolBalance();
    const WPHTsBalance = await wPHT.balanceOf(artistToken.address);
    const WPHTsBalanceExpected = pht2wei((DENOMINATOR_PPM - THETA) * AMOUNT_TO_RAISE_PHT / DENOMINATOR_PPM);

    console.log(`ArtistToken received: ${wei2pht(WPHTsBalance)} WPHT`);

    assert.equal(WPHTsBalance.toString(), WPHTsBalanceExpected.toString());
    assert.equal(poolBalance.toString(), WPHTsBalanceExpected.toString());
  });

  it('should query WPHT and ensure FundingPool has received its calculated ratio', async () => {
    const WPHTsBalance = await wPHT.balanceOf(fundingPool.address);
    const WPHTsBalanceExpected = pht2wei(AMOUNT_TO_RAISE_PHT * THETA  / DENOMINATOR_PPM);

    const tokensBalance = await artistToken.balanceOf(fundingPool.address);

    console.log(`FundingPool received: ${wei2pht(WPHTsBalance)} WPHT`);
    console.log(`FundingPool received: ${wei2pht(tokensBalance)} ${artistTokenSymbol}`);

    assert.equal(WPHTsBalance.toString(), WPHTsBalanceExpected.toString());
  });

  it('should create a reserve of Artist tokens', async () => {
    const tokensAmount = await artistToken.balanceOf(artistToken.address);
    const tokensAmountExpected = pht2wei((AMOUNT_TO_RAISE_PHT / P0 ));

    console.log(`Artist tokens in reserve: ${wei2pht(tokensAmount)} ${artistTokenSymbol}`);

    assert.equal(tokensAmount.toString(), tokensAmountExpected.toString());
  });

  it('should have increased total supply to the level of reserve itself', async () => {
    const totalSupply = await getArtistTokenTotalSupply(web3, { artistTokenAddr: artistToken.address });
    const totalSupplyExpected = await artistToken.balanceOf(artistToken.address);

    console.log(`ArtistToken total supply: ${wei2pht(totalSupply)} ${artistTokenSymbol}`);

    assert.equal(totalSupply.toString(), totalSupplyExpected.toString());
  });

  it('should have assigned correct initial contributions to all hatchers', async () => {
    const contribution = await artistToken.initialContributions(hatcher1);
    const lockedInternal = contribution.lockedInternal;
    const paidExternal = contribution.paidExternal;
    const lockedInternalExpected = pht2wei(PER_HATCHER_CONTRIBUTION_PHT * P0);

    console.log(`Hatcher1 contribution of internal locked artist tokens: ${wei2pht(lockedInternal)} ${artistTokenSymbol}`);
    console.log(`Hatcher1 contribution of external paid tokens: ${wei2pht(paidExternal)} WPHT`);

    const contribution2 = await artistToken.initialContributions(hatcher2);
    const lockedInternal2 = contribution2.lockedInternal;
    const paidExternal2 = contribution.paidExternal;
    const lockedInternalExpected2 = pht2wei(PER_HATCHER_CONTRIBUTION_PHT * P0);

    console.log(`Hatcher2 contribution of internal locked artist tokens: ${wei2pht(lockedInternal2)} ${artistTokenSymbol}`);
    console.log(`Hatcher2 contribution of external paid tokens: ${wei2pht(paidExternal2)} WPHT`);

    assert.equal(lockedInternal.toString(), lockedInternalExpected.toString());
    assert.equal(lockedInternal2.toString(), lockedInternalExpected2.toString());

    assert.equal(paidExternal.toString(), PER_HATCHER_CONTRIBUTION_WEI.toString());
    assert.equal(paidExternal2.toString(), PER_HATCHER_CONTRIBUTION_WEI.toString());
  });

  it('should validate a hatcher has 0 claimed tokens and 0 artist tokens in their direct balance prior first purchases from public (all initial tokens are locked)', async () => {
    await artistToken.claimTokens({from: hatcher1});

    let balance = await getArtistTokenBalanceOf(web3, { artistTokenAddr: artistToken.address, accountAddr: hatcher1 });

    console.log(`Hatcher1 has prior-minting/claiming balance of: ${wei2pht(balance)} ${artistTokenSymbol}`);

    assert.equal(balance.toString(), "0");
  });

  it('should let a buyer1, an average Joe, to buy(mint) artist tokens in exchange for WPHT', async () => {
    const preFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const preArtistTokenWPHTBalance = await wPHT.balanceOf(artistToken.address);
    const preArtistTokenTotalSupply = await artistToken.totalSupply();
    const preBuyer1ArtistTokensBalance = await artistToken.balanceOf(buyer1);

    const postArtistTokenWPHTBalanceExpected = preArtistTokenWPHTBalance.add(BUYER_WPHT_PURCHASE_COST_WEI);
    const purchasedTokensAmountExpected = await artistToken.calculatePurchaseReturn(preArtistTokenTotalSupply, postArtistTokenWPHTBalanceExpected, RESERVE_RATIO, BUYER_WPHT_PURCHASE_COST_WEI);
    const postArtistTokenTotalSupplyExpected = preArtistTokenTotalSupply.add(purchasedTokensAmountExpected);

    console.log(`Prior-buying:`);
    console.log(` - FundingPool balance: ${wei2pht(preFundingPoolWPHTBalance)} WPHT`);
    console.log(` - ArtistToken external balance: ${wei2pht(preArtistTokenWPHTBalance)} WPHT`);
    console.log(` - ArtistToken total supply: ${wei2pht(preArtistTokenTotalSupply)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 purchase cost: ${wei2pht(BUYER_WPHT_PURCHASE_COST_WEI)} WPHT`);
    console.log(` - Buyer1 has: ${wei2pht(preBuyer1ArtistTokensBalance)} ${artistTokenSymbol}`);

    const tokens = await buyArtistTokens(web3, {
      from: buyer1,
      artistTokenAddr: artistToken.address,
      wphtAddr: wPHT.address,
      amountWeiBn: BUYER_WPHT_PURCHASE_COST_WEI,
    });

    const postFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const postArtistTokenWPHTBalance = await wPHT.balanceOf(artistToken.address);
    const postArtistTokenTotalSupply = await artistToken.totalSupply();
    postBuyer1ArtistTokensBalance = await artistToken.balanceOf(buyer1);

    console.log(`Post-buying:`);
    console.log(` - FundingPool balance: ${wei2pht(postFundingPoolWPHTBalance)} WPHT`);
    console.log(` - ArtistToken external balance: ${wei2pht(postArtistTokenWPHTBalance)} WPHT`);
    console.log(` - ArtistToken total supply: ${wei2pht(postArtistTokenTotalSupply)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 has: ${wei2pht(postBuyer1ArtistTokensBalance)} ${artistTokenSymbol}`);

    assert.equal(preFundingPoolWPHTBalance.toString(), postFundingPoolWPHTBalance.toString());
    assert.equal(postArtistTokenWPHTBalance.toString(), postArtistTokenWPHTBalanceExpected.toString());
    assert.equal(postArtistTokenTotalSupply.toString(), postArtistTokenTotalSupplyExpected.toString());
    assert.equal(postBuyer1ArtistTokensBalance.toString(), purchasedTokensAmountExpected.toString());
    assert.equal(postBuyer1ArtistTokensBalance.toString(), tokens.toString());
  });

  it('should be more expensive for buyer2 to purchase artist tokens after buyer1 contribution', async () => {
    await wPHT.deposit({
      from: buyer2,
      value: BUYER_WPHT_PURCHASE_COST_WEI
    });
    const balance = await wPHT.balanceOf(buyer2);

    assert.equal(balance.toString(), BUYER_WPHT_PURCHASE_COST_WEI.toString());

    await wPHT.approve(artistToken.address, BUYER_WPHT_PURCHASE_COST_WEI, {from: buyer2});
    await artistToken.mint(BUYER_WPHT_PURCHASE_COST_WEI, {from: buyer2, gasPrice: GAS_PRICE_WEI});

    const buyer2ArtistTokensBalance = await artistToken.balanceOf(buyer2);

    console.log(`Buyer2 purchased only ${wei2pht(buyer2ArtistTokensBalance).toString()} ${artistTokenSymbol} with the same purchase cost as Buyer1`);

    assert.isTrue(buyer2ArtistTokensBalance.lt(postBuyer1ArtistTokensBalance));
  });

  it('should be possible for buyer1 to sell portion (e.g 33%) of its tokens for at least 10% of his purchase cost', async () => {
    const burnAmount = postBuyer1ArtistTokensBalance.div(new BN(3, 10));
    const preFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const preFeeRecipientWPHTBalance = await wPHT.balanceOf(feeRecipient);
    const preArtistTokenWPHTBalance = await wPHT.balanceOf(artistToken.address);
    const preBuyer1WPHTBalance = await wPHT.balanceOf(buyer1);
    const preBuyer1ArtistTokensBalance = await artistToken.balanceOf(buyer1);
    const preArtistTokenTotalSupply = await artistToken.totalSupply();

    await sellArtistTokens(web3, {
      from: buyer1,
      artistTokenAddr: artistToken.address,
      amountBn: burnAmount,
    });

    const postFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const postFeeRecipientWPHTBalance = await wPHT.balanceOf(feeRecipient);
    const postArtistTokenWPHTBalance = await wPHT.balanceOf(artistToken.address);
    const postBuyer1WPHTBalance = await wPHT.balanceOf(buyer1);
    const postArtistTokenTotalSupply = await artistToken.totalSupply();
    const postArtistTokenTotalSupplyExpected = preArtistTokenTotalSupply.sub(burnAmount);
    const postBuyer1ArtistTokensBalanceExpected = postBuyer1ArtistTokensBalance.sub(burnAmount);
    const postBuyer1MinimumWPHTBalanceExpected = pht2wei(BUYER_WPHT_PURCHASE_COST_PHT / 10);
    postBuyer1ArtistTokensBalance = await artistToken.balanceOf(buyer1);
    const reimbursement = await artistToken.calculateSaleReturn(preArtistTokenTotalSupply, preArtistTokenWPHTBalance, RESERVE_RATIO, burnAmount);
    const feeRecipientWPHTFrictionExpected = reimbursement.mul(new BN(FRICTION, 10)).div(new BN(DENOMINATOR_PPM, 10));
    const postFeeRecipientWPHTBalanceExpected = preFeeRecipientWPHTBalance.add(feeRecipientWPHTFrictionExpected);

    console.log(`Pre-burning:`);
    console.log(` - FundingPool external balance: ${wei2pht(preFundingPoolWPHTBalance)} WPHT`);
    console.log(` - FeeRecipient external balance: ${wei2pht(preFeeRecipientWPHTBalance)} WPHT`);
    console.log(` - ArtistToken external balance: ${wei2pht(preArtistTokenWPHTBalance)} WPHT`);
    console.log(` - ArtistToken total supply: ${wei2pht(preArtistTokenTotalSupply)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 balance: ${wei2pht(preBuyer1ArtistTokensBalance)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 external balance: ${wei2pht(preBuyer1WPHTBalance)} WPHT`);

    console.log(`Post-burning:`);
    console.log(` - FundingPool external balance: ${wei2pht(postFundingPoolWPHTBalance)} WPHT`);
    console.log(` - FeeRecipient external balance: ${wei2pht(postFeeRecipientWPHTBalance)} WPHT`);
    console.log(` - ArtistToken external balance: ${wei2pht(postArtistTokenWPHTBalance)} WPHT`);
    console.log(` - ArtistToken total supply: ${wei2pht(postArtistTokenTotalSupply)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 burn amount: ${wei2pht(burnAmount)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 has left: ${wei2pht(postBuyer1ArtistTokensBalance)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 previous external balance: ${wei2pht(preBuyer1WPHTBalance)} WPHT`);
    console.log(` - Buyer1 new external balance: ${wei2pht(postBuyer1WPHTBalance)} WPHT`);

    assert.equal(postArtistTokenTotalSupply.toString(), postArtistTokenTotalSupplyExpected.toString());
    assert.equal(postBuyer1ArtistTokensBalance.toString(), postBuyer1ArtistTokensBalanceExpected.toString());

    assert.equal(postFeeRecipientWPHTBalance.toString(), postFeeRecipientWPHTBalanceExpected.toString());
    assert.isTrue(postBuyer1MinimumWPHTBalanceExpected.lt(postBuyer1WPHTBalance, 'selling 33% of all buyer tokens should be worth at least 10% of his purchase cost'));
    assert.isTrue(postFundingPoolWPHTBalance.eq(preFundingPoolWPHTBalance), 'funding pool balance should stay the same');
  });

  it('should not be possible to allocate (withdraw) raised funding pool external tokens by a random account', async () => {
    const prefundingPoolBalance = await wPHT.balanceOf(fundingPool.address);
    const preFundingPoolAttackerBalance = await wPHT.balanceOf(fundingPoolAttacker);

    console.log(`Pre-allocating:`);
    console.log(` - FundingPool balance: ${wei2pht(prefundingPoolBalance)} WPHT`);
    console.log(` - FundingPoolAttacker balance: ${wei2pht(preFundingPoolAttackerBalance)} WPHT`);

    await shouldFail.reverting(fundingPool.allocateFunds(artistToken.address, fundingPoolAttacker, prefundingPoolBalance, {from: fundingPoolAttacker}));

    const postFundingPoolBalance = await wPHT.balanceOf(fundingPool.address);
    const postFundingPoolAttackerBalance = await wPHT.balanceOf(fundingPoolAttacker);

    console.log(`Post-allocating:`);
    console.log(` - FundingPool balance: ${wei2pht(postFundingPoolBalance)} WPHT`);
    console.log(` - FundingPoolAttacker balance: ${wei2pht(postFundingPoolAttackerBalance)} WPHT`);

    assert.equal(prefundingPoolBalance.toString(), postFundingPoolBalance.toString(), 'an attacker withdraw artist funding pool!');
    assert.equal(preFundingPoolAttackerBalance.toString(), postFundingPoolAttackerBalance.toString(), 'an attacker withdraw all artist funding pool WPHTs to his account');
  });

  it('should be possible to allocate (withdraw) raised funding pool external tokens by Artist', async () => {
    const prefundingPoolBalance = await wPHT.balanceOf(fundingPool.address);
    const preFundingPoolAccountantBalance = await wPHT.balanceOf(fundingPoolAccountant);

    console.log(`Pre-allocating:`);
    console.log(` - FundingPool balance: ${wei2pht(prefundingPoolBalance)} WPHT`);
    console.log(` - FundingPoolAccountant balance: ${wei2pht(preFundingPoolAccountantBalance)} WPHT`);

    await fundingPool.allocateFunds(artistToken.address, fundingPoolAccountant, prefundingPoolBalance, {from: artist });

    const postFundingPoolBalance = await wPHT.balanceOf(fundingPool.address);
    const postFundingPoolAccountantBalance = await wPHT.balanceOf(fundingPoolAccountant);
    const postFundingPoolAccountantBalanceExpected = preFundingPoolAccountantBalance.add(prefundingPoolBalance);

    console.log(`Post-allocating:`);
    console.log(` - FundingPool balance: ${wei2pht(postFundingPoolBalance)} WPHT`);
    console.log(` - FundingPoolAccountant balance: ${wei2pht(postFundingPoolAccountantBalance)} WPHT`);

    assert.equal(postFundingPoolBalance.toString(), "0");
    assert.equal(postFundingPoolAccountantBalance.toString(), postFundingPoolAccountantBalanceExpected.toString());
  });

  it('should let a hatcher to claim his artist tokens after allocating funds in post-hatch phase', async () => {
    const preClaimContribution = await artistToken.initialContributions(hatcher1);
    const preClaimLockedInternal = preClaimContribution.lockedInternal;
    const preClaimLockedInternalExpected = pht2wei(PER_HATCHER_CONTRIBUTION_PHT * P0);

    const preClaimHatcherWPHTBalance = await wPHT.balanceOf(hatcher1);
    const preClaimHatcherArtistTokensBalance = await artistToken.balanceOf(hatcher1);
    const preClaimFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const preClaimFundingPoolArtistTokensBalance = await artistToken.balanceOf(fundingPool.address);

    console.log(`Pre-claiming:`);
    console.log(` - FundingPool balance: ${wei2pht(preClaimFundingPoolWPHTBalance)} WPHT`);
    console.log(` - FundingPool balance: ${wei2pht(preClaimFundingPoolArtistTokensBalance)} ${artistTokenSymbol}`);
    console.log(` - Hatcher1 has locked: ${wei2pht(preClaimLockedInternal)} ${artistTokenSymbol}`);
    console.log(` - Hatcher1 balance: ${wei2pht(preClaimHatcherWPHTBalance)} WPHT`);
    console.log(` - Hatcher1 balance: ${wei2pht(preClaimHatcherArtistTokensBalance)} ${artistTokenSymbol}`);

    await artistToken.claimTokens({from: hatcher1});

    const postClaimContribution = await artistToken.initialContributions(hatcher1);
    const postClaimLockedInternal = postClaimContribution.lockedInternal;

    const postClaimHatcherWPHTBalance = await wPHT.balanceOf(hatcher1);
    const postClaimHatcherArtistTokensBalance = await artistToken.balanceOf(hatcher1);
    const postClaimFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const postClaimFundingPoolArtistTokensBalance = await artistToken.balanceOf(fundingPool.address);

    console.log(`Post-claiming:`);
    console.log(` - FundingPool balance: ${wei2pht(postClaimFundingPoolWPHTBalance)} WPHT`);
    console.log(` - FundingPool balance: ${wei2pht(postClaimFundingPoolArtistTokensBalance)} ${artistTokenSymbol}`);
    console.log(` - Hatcher1 has locked: ${wei2pht(postClaimLockedInternal)} ${artistTokenSymbol}`);
    console.log(` - Hatcher1 balance: ${wei2pht(postClaimHatcherWPHTBalance)} WPHT`);
    console.log(` - Hatcher1 balance: ${wei2pht(postClaimHatcherArtistTokensBalance)} ${artistTokenSymbol}`);

    assert.equal(preClaimLockedInternal.toString(), preClaimLockedInternalExpected.toString());
    assert.isTrue(postClaimLockedInternal.lt(preClaimLockedInternal), "no hatcher's locked internal artist tokens got unlocked");
    assert.isTrue(postClaimHatcherArtistTokensBalance.gt(preClaimHatcherArtistTokensBalance), "hatcher artist tokens balance didn't increase");
  });

  it('should be possible for hatcher to sell his claimed tokens', async () => {
    const burnAmount = (await artistToken.balanceOf(hatcher1)).div(new BN(3, 10));
    const preBurnHatcherWPHTBalance = await wPHT.balanceOf(hatcher1);

    await artistToken.burn(burnAmount, {from: hatcher1, gasPrice: GAS_PRICE_WEI});

    const postBurnHatcherWPHTBalance = await wPHT.balanceOf(hatcher1);
    const revenue = postBurnHatcherWPHTBalance.sub(preBurnHatcherWPHTBalance);

    console.log(`Hatcher1 sold ${wei2pht(burnAmount)} ${artistTokenSymbol} for ${wei2pht(revenue)} WPHT`);

    assert.isTrue(postBurnHatcherWPHTBalance.gt(preBurnHatcherWPHTBalance));
  });

  it('should be possible to transfer tokens', async () => {
    const preBalanceHatcher1 = await artistToken.balanceOf(hatcher1);
    const preBalanceLightstreams = await artistToken.balanceOf(lightstreams);

    await artistToken.transfer(lightstreams, preBalanceHatcher1, { from: hatcher1 });

    const postBalanceLightstreams = await artistToken.balanceOf(lightstreams);
    const postBalanceLightstreamsExpected = preBalanceLightstreams.add(preBalanceHatcher1);

    assert.equal(postBalanceLightstreams.toString(), postBalanceLightstreamsExpected.toString());
  });

  it('should be possible to pause the economy', async () => {
    await artistToken.pause({ from: lightstreams });

    const isPaused = await artistToken.paused();

    assert.isTrue(isPaused);
  });

  it('should not be possible to mint new tokens when paused', async () => {
    const depositWei = pht2wei(1);

    await wPHT.deposit({
      from: buyer1,
      value: depositWei
    });
    await wPHT.approve(artistToken.address, depositWei, {from: buyer1});

    await shouldFail.reverting(artistToken.mint(depositWei, {from: buyer1, gasPrice: GAS_PRICE_WEI}));
  });

  it('should not be possible to burn any tokens when paused', async () => {
    const burnAmount = await artistToken.balanceOf(buyer2);

    await shouldFail.reverting(artistToken.burn(burnAmount, {from: buyer2, gasPrice: GAS_PRICE_WEI}));
  });

  it('should not be possible to claim any tokens when paused', async () => {
    await shouldFail.reverting(artistToken.claimTokens({from: hatcher2}));
  });

  it('should not be possible to withdraw any funds when paused', async () => {
    const balance = await wPHT.balanceOf(fundingPool.address);

    await shouldFail.reverting(fundingPool.allocateFunds(artistToken.address, fundingPoolAccountant, balance, {from: artist}));
  });

  it('should not be possible to transfer tokens when paused', async () => {
    const preBalanceLightstreams = await artistToken.balanceOf(lightstreams);

    await shouldFail.reverting(artistToken.transfer(hatcher1, preBalanceLightstreams, { from: lightstreams }));
  });

  it('should be possible to un-pause, resume the economy', async () => {
    await artistToken.unpause({ from: lightstreams });

    const isPaused = await artistToken.paused();

    assert.isFalse(isPaused);
  });
});
