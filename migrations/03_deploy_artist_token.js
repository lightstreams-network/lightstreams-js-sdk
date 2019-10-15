// ReserveTokenMock will be an existing smart contract (DAI)
const WPHT = artifacts.require("WPHT");
const ArtistToken = artifacts.require("ArtistToken");
const FundingPoolMock = artifacts.require("FundingPoolMock");

// Curve parameters:
const reserveRatio = 142857;  // Kappa (~ 6)
const theta = 350000;         // 35% in ppm
const p0 = 1;                // Price of internal token in external tokens.
const initialRaise = 300000;  // Raise amount in external tokens.
const friction = 20000;       // 2% in ppm
const gasPrice = 15000000000; // 15 gwei
const duration = 3024000000000000; // ~5 weeks.
const minExternalContibution = 100000;

module.exports = function(deployer) {
  const fromAccount = process.env.ACCOUNT;
  let fundingPoolInstance;
  let WPHTInstance;

  deployer.then(() => {
    return FundingPoolMock.deployed();
  }).then((curInstance) => {
    if (curInstance.address && !global.forceMigration('03')) {
      console.log(`Contract already deployed ${curInstance.address}. Skipped migration "03_deploy_artist_token.js`);
      return null;
    }

    return deployer.deploy(FundingPoolMock)
      .then(instance => {
        fundingPoolInstance = instance;
        return deployer.deploy(WPHT, fromAccount)
      })
      .then(instance => {
        WPHTInstance = instance;
        return deployer.deploy(
          ArtistToken,
          "Armin Van Lightstreams",
          "AVL",
          WPHTInstance.address, // _externalToken
          reserveRatio,
          gasPrice,
          theta,
          p0,
          initialRaise,
          fundingPoolInstance.address,
          friction,
          duration,
          minExternalContibution,
          { gas: 10000000 });
      });
  })
};
