// ReserveTokenMock will be an existing smart contract (DAI)
const WPHT = artifacts.require('WPHT');
const FundingPool = artifacts.require('FundingPool');
const ArtistToken = artifacts.require('ArtistToken');

const {deployArtistToken, hatchArtistToken, isArtistTokenHatched} = require('../src/contracts/artist_token');
const {forceMigration} = require('./00_unlock_account');
const Web3Wrapper = require('../src/web3');

// Curve parameters:
const reserveRatio = 142857;  // Kappa (~ 6)
const theta = 350000;         // 35% in ppm
const p0 = 1;                 // Price of internal token in external tokens.
const initialRaise = 300;     // Raise amount in external tokens.
const friction = 20000;       // 2% in ppm
const gasPrice = 500000000000; // 500 gwei
const hatchDurationSeconds = 3024000; // 5 weeks
const hatchVestingDurationSeconds = 0; // 3 months
const minExternalContribution = 10;

module.exports = function(deployer) {
  const fromAccount = process.env.ACCOUNT;

  if (!forceMigration('03')) {
    console.log(`Skipped migration "03_deploy_artist_token.js"`);
    return null;
  }

  let fundingPoolAddr;
  let feeRecipientAddr;
  let artistTokenAddr;
  let wphtAddr;

  deployer.then(() => {
    return deployer.deploy(FundingPool)
        .then((fundingPoolInstance) => {
          console.log(`FundingPoolInstance deployed at: ${fundingPoolInstance.address}`);
          fundingPoolAddr = fundingPoolInstance.address;
          feeRecipientAddr = fundingPoolInstance.address;
          return deployer.deploy(WPHT, fromAccount);
        })
        .then(WPHTInstance => {
          console.log(`WPHTInstance deployed at: ${WPHTInstance.address}`);
          wphtAddr = WPHTInstance.address;
          const name = 'Armin Van Lightstreams';
          const symbol = 'AVL';
          const initialRaiseInWeiBN = Web3Wrapper.utils.toBN(Web3Wrapper.utils.toWei(`${initialRaise}`));
          return deployer.deploy(ArtistToken,
              name,
              symbol,
              [wphtAddr, fundingPoolAddr, feeRecipientAddr, fromAccount],
              [
                gasPrice, theta, p0, initialRaiseInWeiBN,
                friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution,
              ],
              reserveRatio, {
                from: fromAccount,
                gas: 10000000,
              });
        })
        .then(artistTokenInstance => {
          console.log(`ArtistTokenInstance deployed at: ${artistTokenInstance.address}`);
          artistTokenAddr = artistTokenInstance.address;
          return hatchArtistToken(web3, {
            from: fromAccount,
            artistTokenAddr,
            wphtAddr: wphtAddr,
            amountWeiBn: Web3Wrapper.utils.toBN(Web3Wrapper.utils.toWei(`${initialRaise}`)),
          }, true);
        })
        .then(() => {
          return isArtistTokenHatched(web3, {artistTokenAddr});
        })
        .then((isHatched) => {
          console.log(`ArtistToken ${artistTokenAddr} is hatched: ${isHatched}`);
        });
  }).catch(err => {
    console.error(err);
    throw err;
  });
};
