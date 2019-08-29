/**
 * User: ggarrido
 * Date: 29/08/19 18:13
 * Copyright 2019 (c) Lightstreams, Granada
 */

const ethers = require('ethers');

const showProgressCb = (progress) => {
  console.log("Encrypting: " + parseInt(progress * 100) + "% complete");
};

module.exports.createRandomWallet = async (password) => {
  const wallet = ethers.Wallet.createRandom();
  return JSON.parse(await wallet.encrypt(password, showProgressCb));
};

module.exports.generateRandomSeedPhrase = (bytes = 16) => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(bytes), ethers.wordlists.en);
};

module.exports.createWallet = async (mnemonic, password) => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  return await wallet.encrypt(password, showProgressCb);
};

module.exports.decryptWallet = async (encryptedWalletJson, password) => {
  return await ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWalletJson), password, showProgressCb);
};