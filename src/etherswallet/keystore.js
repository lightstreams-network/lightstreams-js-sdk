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
  let options = {
    scrypt: {
      N: (1 << 8), //N: (1 << 16),
      r: 8,
      p: 1
    }
  };
  return JSON.parse(await wallet.encrypt(password, options, (progress) => showProgressCb('Encrypt wallet', progress * 100)));
};

module.exports.decryptWallet = (encryptedWalletJson, password) => {
  return new Promise((resolve, reject) => {
    ethers.Wallet.fromEncryptedJson(JSON.stringify(encryptedWalletJson), password,
      (progress) => showProgressCb('Decrypt wallet', progress * 100)
    ).then(resolve).catch(reject);
  });
};