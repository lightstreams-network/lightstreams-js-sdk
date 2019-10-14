require('dotenv').config({ path: `${__dirname}/.env` });

const { BN, constants, expectEvent, shouldFail, ether } = require('openzeppelin-test-helpers');

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const ArtistTokenSc = artifacts.require("ArtistToken");
const WPHTSc = artifacts.require("WPHT");
const FundingPoolMockSc = artifacts.require("FundingPoolMock");

const pht2wei = (value) => {
  return ether(value.toString());
};

function wei2pht (n) {
  return web3.utils.fromWei(n, 'ether');
}

contract('ArtistToken', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : process.env.ACCOUNT;

  const TX_COST_BUFFER_PHT = 10;
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
  const DURATION = 604800; // 1 week in seconds
  const DENOMINATOR_PPM = 1000000;

  const ARTIST_NAME = 'Armin Van Lightstreams';
  const ARTIST_SYMBOL = 'AVL';

  let hatcher1;
  let hatcher2;
  let buyer1;
  let buyer2;

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

    await web3.eth.personal.unlockAccount(hatcher1, accPwd, 1000);
    await web3.eth.personal.unlockAccount(hatcher2, accPwd, 1000);
    await web3.eth.personal.unlockAccount(buyer1, accPwd, 1000);
    await web3.eth.personal.unlockAccount(buyer2, accPwd, 1000);

    console.log(`Hatcher1 account ${hatcher1} created.`);
    console.log(`Hatcher2 account ${hatcher2} created.`);
    console.log(`Buyer1 account ${buyer1} created.`);
    console.log(`Buyer2 account ${buyer2} created.`);

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
  });

  it('should deploy a FundingPool', async () => {
    fundingPool = await FundingPoolMockSc.new();

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
      wPHT.address,
      RESERVE_RATIO,
      GAS_PRICE_WEI,
      THETA,
      P0,
      AMOUNT_TO_RAISE_WEI,
      fundingPool.address,
      FRICTION,
      DURATION,
      MIN_REQUIRED_HATCHER_CONTRIBUTION_WEI,
      {
        from: ROOT_ACCOUNT,
        gas: 10000000
      }
    );

    console.log(`ArtistToken addr: ${artistToken.address}`);
  });

  it("should fund hatchers with WPHT tokens", async () => {
    let tx = await wPHT.deposit({
      from: hatcher1,
      value: INIT_HATCHER_WPHT_BALANCE_WEI
    });
    assert.equal(tx.receipt.status, true);

    tx = await wPHT.deposit({
      from: hatcher2,
      value: INIT_HATCHER_WPHT_BALANCE_WEI
    });
    assert.equal(tx.receipt.status, true);

    const hatcher1WPHTBalance = await wPHT.balanceOf(hatcher1);
    const hatcher2WPHTBalance = await wPHT.balanceOf(hatcher2);

    assert.equal(hatcher1WPHTBalance.toString(), INIT_HATCHER_WPHT_BALANCE_WEI.toString());
    assert.equal(hatcher2WPHTBalance.toString(), INIT_HATCHER_WPHT_BALANCE_WEI.toString());
  });

  it("should be in a 'hatching phase' after deployed", async () => {
    const isHatched = await artistToken.isHatched();

    assert.isFalse(isHatched);
  });

  it('should end the hatching phase by contributing configured minimum amount to raise from 2 hatchers', async () => {
    await wPHT.approve(artistToken.address, PER_HATCHER_CONTRIBUTION_WEI, {from: hatcher1});
    await artistToken.hatchContribute(PER_HATCHER_CONTRIBUTION_WEI, {from: hatcher1});
    let isHatched = await artistToken.isHatched();

    console.log(`Hatcher1 contributed: ${wei2pht(PER_HATCHER_CONTRIBUTION_WEI)} WPHT`);

    assert.isFalse(isHatched);

    await wPHT.approve(artistToken.address, PER_HATCHER_CONTRIBUTION_WEI, {from: hatcher2});
    await artistToken.hatchContribute(PER_HATCHER_CONTRIBUTION_WEI, {from: hatcher2});
    isHatched = await artistToken.isHatched();

    console.log(`Hatcher2 contributed: ${wei2pht(PER_HATCHER_CONTRIBUTION_WEI)} WPHT`);

    assert.isTrue(isHatched);
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

    console.log(`FundingPool received: ${wei2pht(WPHTsBalance)} WPHT`);

    assert.equal(WPHTsBalance.toString(), WPHTsBalanceExpected.toString());
  });

  it('should create a reserve of Artist tokens', async () => {
    artistTokenSymbol = await artistToken.symbol.call();
    const tokensAmount = await artistToken.balanceOf(artistToken.address);
    const tokensAmountExpected = pht2wei((AMOUNT_TO_RAISE_PHT / P0 ) * (1 - (THETA  / DENOMINATOR_PPM)));

    console.log(`Artist tokens in reserve: ${wei2pht(tokensAmount)} ${artistTokenSymbol}`);

    assert.equal(tokensAmount.toString(), tokensAmountExpected.toString());
  });

  it('should have increased total supply to the level of reserve itself', async () => {
    const totalSupply = await artistToken.totalSupply();
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

    let balance = await artistToken.balanceOf(hatcher1);

    console.log(`Hatcher1 has prior-minting/claiming balance of: ${wei2pht(balance)} ${artistTokenSymbol}`);

    assert.equal(balance.toString(), "0");
  });

  it('should let a buyer1, an average Joe, to purchase WPHT tokens in order to be able to exchange them for artist tokens afterwards', async () => {
    await wPHT.deposit({
      from: buyer1,
      value: BUYER_WPHT_PURCHASE_COST_WEI
    });

    const balance = await wPHT.balanceOf(buyer1);

    assert.equal(balance.toString(), BUYER_WPHT_PURCHASE_COST_WEI.toString());
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

    await wPHT.approve(artistToken.address, BUYER_WPHT_PURCHASE_COST_WEI, {from: buyer1});
    await artistToken.mint(BUYER_WPHT_PURCHASE_COST_WEI, {from: buyer1, gasPrice: GAS_PRICE_WEI});

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
    const preArtistTokenWPHTBalance = await wPHT.balanceOf(artistToken.address);
    const preBuyer1WPHTBalance = await wPHT.balanceOf(buyer1);
    const preBuyer1ArtistTokensBalance = await artistToken.balanceOf(buyer1);
    const preArtistTokenTotalSupply = await artistToken.totalSupply();

    await artistToken.burn(burnAmount, {from: buyer1, gasPrice: GAS_PRICE_WEI});

    const postFundingPoolWPHTBalance = await wPHT.balanceOf(fundingPool.address);
    const postArtistTokenWPHTBalance = await wPHT.balanceOf(artistToken.address);
    const postBuyer1WPHTBalance = await wPHT.balanceOf(buyer1);
    const postArtistTokenTotalSupply = await artistToken.totalSupply();
    const postArtistTokenTotalSupplyExpected = preArtistTokenTotalSupply.sub(burnAmount);
    const postBuyer1ArtistTokensBalanceExpected = postBuyer1ArtistTokensBalance.sub(burnAmount);
    const postBuyer1MinimumWPHTBalanceExpected = pht2wei(BUYER_WPHT_PURCHASE_COST_PHT / 10);
    postBuyer1ArtistTokensBalance = await artistToken.balanceOf(buyer1);

    console.log(`Pre-burning:`);
    console.log(` - FundingPool balance: ${wei2pht(preFundingPoolWPHTBalance)} WPHT`);
    console.log(` - ArtistToken external balance: ${wei2pht(preArtistTokenWPHTBalance)} WPHT`);
    console.log(` - ArtistToken total supply: ${wei2pht(preArtistTokenTotalSupply)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 balance: ${wei2pht(preBuyer1ArtistTokensBalance)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 external balance: ${wei2pht(preBuyer1WPHTBalance)} WPHT`);

    console.log(`Post-burning:`);
    console.log(` - FundingPool balance: ${wei2pht(postFundingPoolWPHTBalance)} WPHT`);
    console.log(` - ArtistToken external balance: ${wei2pht(postArtistTokenWPHTBalance)} WPHT`);
    console.log(` - ArtistToken total supply: ${wei2pht(postArtistTokenTotalSupply)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 burn amount: ${wei2pht(burnAmount)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 has left: ${wei2pht(postBuyer1ArtistTokensBalance)} ${artistTokenSymbol}`);
    console.log(` - Buyer1 previous external balance: ${wei2pht(preBuyer1WPHTBalance)} WPHT`);
    console.log(` - Buyer1 new external balance: ${wei2pht(postBuyer1WPHTBalance)} WPHT`);

    assert.equal(postArtistTokenTotalSupply.toString(), postArtistTokenTotalSupplyExpected.toString());
    assert.equal(postBuyer1ArtistTokensBalance.toString(), postBuyer1ArtistTokensBalanceExpected.toString());

    // @TODO FIX THIS
    // 339960883258061203781 new buyer balance
    // 333161665592899979705 expected balance according to JS calc
    // WHY???
    //  @TODO The problem is bc solidity is rounding the decimal calculation and it's always 1 * reimbursement
    //  @TODO Remember the funding pool balance should increase after this equation gets fixed (added assertion so this test is failing now)
    //
    // const reimbursement = await artistToken.calculateSaleReturn(preArtistTokenTotalSupply, preArtistTokenWPHTBalance, RESERVE_RATIO, burnAmount);
    // const revenue = new BN((1 - (FRICTION / DENOMINATOR_PPM)) * 100, 10).mul(reimbursement).div(new BN(100, 10));
    // const postBuyer1WPHTBalanceExpected = preBuyer1WPHTBalance.add(revenue);
    // assert.equal(postBuyer1WPHTBalance.toString(), postBuyer1WPHTBalanceExpected.toString());

    assert.isTrue(postBuyer1MinimumWPHTBalanceExpected.lt(postBuyer1WPHTBalance, 'selling 33% of all buyer tokens should be worth at least 10% of his purchase cost'));
    assert.isTrue(postFundingPoolWPHTBalance.gt(preFundingPoolWPHTBalance), 'funding pool balance should increase when burning tokens');
  });

  // TODO: Seems there is a bug in endHatching function as no artist tokens were allocated to the funding pool
  // it('@TODO: should allocate funds from funding pool to hatchers', async () => {
  // const tokensAmount = await artistToken.balanceOf(fundingPool.address);
  // await fundingPool.allocateFunds(hatcher1, PER_HATCHER_CONTRIBUTION_WEI);
  //
  // console.log(`FundingPool balance: ${tokensAmount.toString()} AVL`);
  //
  // const contribution = await artistToken.initialContributions(hatcher1);
  // const lockedInternal = contribution.lockedInternal;
  // const paidExternal = contribution.paidExternal;
  // const lockedInternalExpected = toPHTs(PER_HATCHER_CONTRIBUTION_PHT * P0);

  // console.log(`FundingPool has: ${wei2pht(tokensAmount)} ${artistTokenSymbol}`);
  // console.log(`Total unlocked internal artist tokens: ${unlockedInternal}`);
  // console.log(`Hatcher1 contribution of internal locked artist tokens: ${lockedInternal} ${artistTokenSymbol}`);
  // console.log(`Hatcher1 contribution of external paid tokens: ${paidExternal} WPHT`);
  // });
});
