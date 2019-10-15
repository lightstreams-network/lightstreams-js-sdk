require('dotenv').config({ path: `${process.env.PWD}/.env` });

module.exports = (deployer) => {
  process.env.NETWORK = deployer.network;
  process.env.MIGRATIONS = (() => {
    // return every migration ID in case of force migration is "true"
    // @TODO: Automatically load file prefix(Migration IDs) from local filesystem
    if (process.env.FORCE_MIGRATION === 'true') return ['01', '02', '03'];

    // Otherwise extract ID in between following symbol '_'
    process.env.FORCED_MIGRATIONS = process.env.FORCE_MIGRATION.split('_');
  })();

  deployer.then(function() {
    if (deployer.network === 'ganache') {
      return true;
    }

    return web3.eth.personal.unlockAccount(process.env.ACCOUNT, process.env.PASSPHRASE, 1000)
      .then(console.log('Root Account unlocked!'))
      .catch((err) => {
        console.log(err);
      });
  });
};
