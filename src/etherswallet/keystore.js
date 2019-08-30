/**
 * User: ggarrido
 * Date: 29/08/19 18:13
 * Copyright 2019 (c) Lightstreams, Granada
 */

const ethers = require('ethers');

const showProgressCb = (actionText, progress) => {
  if((progress % 5) === 0){
    console.log(`${actionText}: ` + parseInt(progress) + "% complete");
  }
};

module.exports.createRandomWallet = async (password) => {
  const wallet = ethers.Wallet.createRandom();
  return JSON.parse(await wallet.encrypt(password, (progress) => showProgressCb('Create random wallet', progress*100)));
};

module.exports.generateRandomSeedPhrase = (bytes = 16) => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(bytes), ethers.wordlists.en);
};

module.exports.createWallet = async (mnemonic, password) => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  return JSON.parse(await wallet.encrypt(password, (progress) => showProgressCb('Create seeded wallet', progress * 100)));
};

module.exports.decryptWallet = async (encryptedWalletJson, password) => {
  return await ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWalletJson), password,
    (progress) => showProgressCb('Decrypt wallet', progress * 100));
};