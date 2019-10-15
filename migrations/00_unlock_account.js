require('dotenv').config({ path: `${process.env.PWD}/.env` });

global.forceMigration = (migrationId) => {
  if (typeof process.env.FORCE_MIGRATION !== 'string') {
    return false;
  }

  if (['true', 'false'].indexOf(process.env.FORCE_MIGRATION) !== -1) {
    return process.env.FORCE_MIGRATION === 'true'
  }

  const forcedMigrations = process.env.FORCE_MIGRATION.split('_');
  return forcedMigrations.indexOf(migrationId) !== -1
};

module.exports = (deployer) => {
  process.env.NETWORK = deployer.network;

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
