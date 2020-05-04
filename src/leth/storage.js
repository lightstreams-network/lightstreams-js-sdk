/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 11/12/19 10:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

const aclSc = require('../../build/contracts/ACL.json');
const acl = require('./acl');

/**
 * Uploads a new file into Smart Vault.
 *
 * @param from {string} Address paying ACL deployment fee
 * @param owner {string} Address of the owner of the file in SC
 * @param file {ReadableStream|File} File to add
 * @param isPublic {boolean} Whenever everyone can read the file content
 *
 * @returns Object{acl: "0xF1E3dC4E704D18783fF58b1f1217f2d82f0b9544", meta: "QmVd6sTUugEUugimMNWLcczhgN3zxunRQmriYQzzi9bRzV"}
 */
module.exports.add = async (web3, gatewayStorage, { from, owner, file, isPublic = false }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("owner", owner);

  const receipt = await acl.create(web3, {from, owner, isPublic});

  return await gatewayStorage.addWithAcl(owner, receipt.contractAddress, file);
};

/**
 * Fetch information about the Smart Vault node.
 *
 * @returns {Promise<{ peer_id: <string>, }>}
 */
module.exports.status = async (web3, gatewayStorage) => {
  return await gatewayStorage.status();
};
