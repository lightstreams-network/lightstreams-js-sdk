/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

const artistTokenSc = require('../../build/contracts/ArtistToken.json');
const fundingPoolSc = require('../../build/contracts/FundingPoolMock.json');
const wphtSc        = require('../../build/contracts/WPHT.json');

module.exports.deployFundingPool = async (web3, { from }) => {
  if (!Web3Wrapper.utils.isAddress(from)) {
    throw new Error(`Invalid argument "from": "${from}". Expected eth address`);
  }

  const receipt = await Web3Wrapper.deployContract(
    web3,
    {
      from,
      useGSN: false,
      abi: fundingPoolSc.abi,
      bytecode: fundingPoolSc.bytecode,
      params: []
    }
  );

  console.log(`FundingPool deployed at: ${receipt.contractAddress}`);

  return receipt;
};

module.exports.deployArtistToken = async (
  web3,
  {
    from,
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

  console.log(`ArtistToken deployed at: ${receipt.contractAddress}`);

  return receipt;
};

module.exports.isArtistTokenHatched = async (web3, { artistTokenAddr }) => {
  if (!Web3Wrapper.utils.isAddress(artistTokenAddr)) {
    throw new Error(`Invalid argument "artistTokenAddr": "${artistTokenAddr}". Expected eth address`);
  }

  const isHatched = await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      useGSN: false,
      method: 'isHatched',
      abi: artistTokenSc.abi,
      params: [],
    }
  );

  console.log(`ArtistToken ${artistTokenAddr} is hatched: ${isHatched}`);

  return isHatched;
};

module.exports.hatchArtistToken = async (web3, { from, artistTokenAddr, wphtAddr, amountWeiBn }) => {
  if (!Web3Wrapper.utils.isAddress(from)) {
    throw new Error(`Invalid argument "from": "${from}". Expected eth address`);
  }

  if (!Web3Wrapper.utils.isAddress(artistTokenAddr)) {
    throw new Error(`Invalid argument "artistTokenAddr": "${artistTokenAddr}". Expected eth address`);
  }

  if (!Web3Wrapper.utils.isAddress(wphtAddr)) {
    throw new Error(`Invalid argument "wphtAddr": "${wphtAddr}". Expected eth address`);
  }

  if (!Web3Wrapper.utils.isBN(amountWeiBn)) {
    throw new Error(`Invalid "amount" value "${amountWeiBn}". Expected valid Wei amount represented as a BN`);
  }

  await Web3Wrapper.contractSendTx(
    web3,
    {
      to: wphtAddr,
      from: from,
      useGSN: false,
      method: 'approve',
      abi: wphtSc.abi,
      params: [artistTokenAddr, amountWeiBn.toString()],
    }
  );

  await Web3Wrapper.contractSendTx(
    web3,
    {
      to: artistTokenAddr,
      from: from,
      useGSN: false,
      method: 'hatchContribute',
      gas: 1000000,
      abi: artistTokenSc.abi,
      params: [amountWeiBn.toString()],
    }
  );

  console.log(`Hatcher ${from} sent a hatch worth ${Web3Wrapper.utils.wei2pht(amountWeiBn)} PHT to ArtistToken ${artistTokenAddr}`);
};

module.exports.getArtistTokenTotalSupply = async (web3, { artistTokenAddr }) => {
  if (!Web3Wrapper.utils.isAddress(artistTokenAddr)) {
    throw new Error(`Invalid argument "artistTokenAddr": "${artistTokenAddr}". Expected eth address`);
  }

  const totalSupply = await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      useGSN: false,
      method: 'totalSupply',
      abi: artistTokenSc.abi,
      params: [],
    }
  );

  console.log(`ArtistToken ${artistTokenAddr} total supply is: ${Web3Wrapper.utils.wei2pht(totalSupply)} PHT`);

  return totalSupply;
};
