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

module.exports.createRandomWallet = () => {
  return ethers.Wallet.createRandom();
};

module.exports.generateRandomSeedPhrase = (bytes = 16) => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(bytes), ethers.wordlists.en);
};

module.exports.createWallet = (mnemonic) => {
  return ethers.Wallet.fromMnemonic(mnemonic);
};

module.exports.encryptWallet = async (wallet, password) => {
  return JSON.parse(await wallet.encrypt(password, (progress) => showProgressCb('Encrypt wallet', progress * 100)));
};

module.exports.decryptWallet = async (encryptedWalletJson, password) => {
  return await ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWalletJson), password,
    (progress) => showProgressCb('Decrypt wallet', progress * 100));
};