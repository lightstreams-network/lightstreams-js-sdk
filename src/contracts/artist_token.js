/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

const artistTokenSc = require('../../build/contracts/ArtistToken.json');

module.exports.deployArtistToken = async (
  web3,
  from,
  {
    name,
    symbol,
    wphtAddr,
    fundingPoolAddr,
    reserveRatio,
    gasPrice,
    theta,
    p0,
    initialRaise,
    friction,
    durationSeconds: durationSeconds,
    minExternalContribution
  }) => {
  if (name && !name.length > 1) {
    throw new Error(`Invalid argument "name": "${name}". Expected a valid artist name`);
  }

  if (symbol && !symbol.length === 3) {
    throw new Error(`Invalid argument "symbol": "${symbol}". Expected a 3 char artist symbol`);
  }
  symbol = symbol.toUpperCase();

  if (!Web3Wrapper.utils.isAddress(wphtAddr)) {
    throw new Error(`Invalid argument "wphtAddr": "${wphtAddr}". Expected WPHT contract eth address`);
  }

  if (!Web3Wrapper.utils.isAddress(fundingPoolAddr)) {
    throw new Error(`Invalid argument "fundingPoolAddr": "${fundingPoolAddr}". Expected FundingPool contract eth address`);
  }

  if (isNaN(parseInt(reserveRatio))) {
    throw new Error(`Invalid "reserveRatio" value "${reserveRatio}". Expected an integer number`);
  }

  if (isNaN(parseInt(gasPrice))) {
    throw new Error(`Invalid "gasPrice" value "${gasPrice}". Expected an integer number`);
  }

  if (isNaN(parseInt(theta))) {
    throw new Error(`Invalid "theta" value "${theta}". Expected an integer number`);
  }

  if (isNaN(parseInt(p0))) {
    throw new Error(`Invalid "p0" value "${p0}". Expected an integer number`);
  }

  if (isNaN(parseInt(initialRaise))) {
    throw new Error(`Invalid "initialRaise" value "${initialRaise}". Expected an integer number`);
  }

  if (isNaN(parseInt(friction))) {
    throw new Error(`Invalid "friction" value "${friction}". Expected an integer number`);
  }

  if (isNaN(parseInt(durationSeconds))) {
    throw new Error(`Invalid "duration" value "${durationSeconds}". Expected an integer number`);
  }

  if (isNaN(parseInt(minExternalContribution))) {
    throw new Error(`Invalid "minExternalContribution" value "${minExternalContribution}". Expected an integer number`);
  }

  const receipt = await Web3Wrapper.deployContract(
      web3,
      {
        from,
        useGSN: false,
        abi: artistTokenSc.abi,
        bytecode: artistTokenSc.bytecode,
        params: [
          name,
          symbol,
          wphtAddr,
          reserveRatio,
          gasPrice,
          theta,
          p0,
          initialRaise,
          fundingPoolAddr,
          friction,
          durationSeconds,
          minExternalContribution,
        ]
      }
    );

  console.log(`\n   ArtistToken deployed at: ${receipt.contractAddress}\n`);

  return receipt;
};
