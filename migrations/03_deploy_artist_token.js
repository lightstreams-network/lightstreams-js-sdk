// ReserveTokenMock will be an existing smart contract (DAI)
const WPHT = artifacts.require("WPHT");
const FundingPool = artifacts.require("FundingPool");

const { deployArtistToken } = require('../src/contracts/artist_token');

// Curve parameters:
const reserveRatio = 142857;  // Kappa (~ 6)
const theta = 350000;         // 35% in ppm
const p0 = 1;                 // Price of internal token in external tokens.
const initialRaise = 300000;  // Raise amount in external tokens.
const friction = 20000;       // 2% in ppm
const gasPrice = 15000000000; // 15 gwei
const hatchDurationSeconds = 3024000; // 5 weeks
const hatchVestingDurationSeconds = 7890000; // 3 months
const minExternalContibution = 100000;

module.exports = function(deployer) {
  const fromAccount = process.env.ACCOUNT;

  deployer.then(() => {
    return global.forceMigration('03')
      ? deployer.deploy(FundingPool)
      : FundingPool.deployed();
  }).then((fundingPoolInstance) => {
    if (!global.forceMigration('03')) {
      console.log(`Contract already deployed ${fundingPoolInstance.address}. Skipped migration "03_deploy_artist_token.js`);
      return null;
    }

    return deployer.deploy(WPHT, fromAccount)
      .then(WPHTInstance => {
        return deployArtistToken(web3, {
            from: fromAccount,
            name: "Armin Van Lightstreams",
            symbol: "AVL",
            wphtAddr: WPHTInstance.address,
            fundingPoolAddr: fundingPoolInstance.address,
            feeRecipientAddr: fundingPoolInstance.address,
            pauserAddr: fromAccount,
            reserveRatio: reserveRatio,
            gasPrice: gasPrice,
            theta: theta,
            p0: p0,
            initialRaise: initialRaise,
            friction: friction,
            hatchDurationSeconds: hatchDurationSeconds,
            hatchVestingDurationSeconds: hatchVestingDurationSeconds,
            minExternalContribution: minExternalContibution
          }
        );
      });
  }).then(receipt => {
    console.log(`ArtistToken deployed at: ${receipt.contractAddress}`);
  }).catch(err => {
    console.error(err);
    throw err;
  })
};
