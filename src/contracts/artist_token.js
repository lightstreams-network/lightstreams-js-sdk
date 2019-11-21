/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');

const artistTokenSc = require('../../build/contracts/ArtistToken.json');
const fundingPoolSc = require('../../build/contracts/FundingPool.json');
const wphtSc        = require('../../build/contracts/WPHT.json');

module.exports.deployFundingPool = async (web3, { from }) => {
  Web3Wrapper.validator.validateAddress("from", from);

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
    feeRecipientAddr,
    pauserAddr,
    reserveRatio,
    gasPrice,
    theta,
    p0,
    initialRaise,
    friction,
    hatchDurationSeconds,
    hatchVestingDurationSeconds,
    minExternalContribution
  }) => {
  if (name && !name.length > 1) {
    throw new Error(`Invalid argument "name": "${name}". Expected a valid artist name`);
  }

  if (symbol && !symbol.length === 3) {
    throw new Error(`Invalid argument "symbol": "${symbol}". Expected a 3 char artist symbol`);
  }
  symbol = symbol.toUpperCase();

  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
  Web3Wrapper.validator.validateAddress("fundingPoolAddr", fundingPoolAddr);
  Web3Wrapper.validator.validateAddress("feeRecipientAddr", feeRecipientAddr);
  Web3Wrapper.validator.validateAddress("pauserAddr", pauserAddr);

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

  if (isNaN(parseInt(hatchDurationSeconds))) {
    throw new Error(`Invalid "hatch duration" value "${hatchDurationSeconds}". Expected an integer number`);
  }

  if (isNaN(parseInt(hatchVestingDurationSeconds))) {
    throw new Error(`Invalid "hatch vesting duration" value "${hatchVestingDurationSeconds}". Expected an integer number`);
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
          [wphtAddr, fundingPoolAddr, feeRecipientAddr, pauserAddr],
          [gasPrice, theta, p0, initialRaise, friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution],
          reserveRatio
        ]
      }
    );

  console.log(`ArtistToken deployed at: ${receipt.contractAddress}`);

  return receipt;
};

module.exports.isArtistTokenHatched = async (web3, { artistTokenAddr }) => {
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

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
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
  Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);

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
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

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

const getArtistTokenName = async (web3, { artistTokenAddr }) => {
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

  return await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      useGSN: false,
      method: 'name',
      abi: artistTokenSc.abi,
      params: [],
    }
  );
};
module.exports.getArtistTokenSymbol = getArtistTokenName;

const getArtistTokenSymbol = async (web3, { artistTokenAddr }) => {
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);

  return await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      useGSN: false,
      method: 'symbol',
      abi: artistTokenSc.abi,
      params: [],
    }
  );
};
module.exports.getArtistTokenSymbol = getArtistTokenSymbol;

module.exports.getArtistTokenBalanceOf = async (web3, { artistTokenAddr, accountAddr }) => {
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
  Web3Wrapper.validator.validateAddress("accountAddr", accountAddr);

  const symbol = await getArtistTokenSymbol(web3, { artistTokenAddr });

  const balance = await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      useGSN: false,
      method: 'balanceOf',
      abi: artistTokenSc.abi,
      params: [accountAddr],
    }
  );

  console.log(`Account ${accountAddr} has ${Web3Wrapper.utils.wei2pht(balance.toString())} ${symbol} of ArtistToken ${artistTokenAddr}`);

  return Web3Wrapper.utils.toBN(balance);
};

module.exports.buyArtistTokens = async (web3, { from, artistTokenAddr, wphtAddr, amountWeiBn }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
  Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);

  const symbol = await getArtistTokenSymbol(web3, { artistTokenAddr });

  await Web3Wrapper.contractSendTx(
    web3,
    {
      from: from,
      to: wphtAddr,
      value: amountWeiBn.toString(),
      useGSN: false,
      method: 'deposit',
      abi: wphtSc.abi,
      params: [],
    }
  );

  await Web3Wrapper.contractSendTx(
    web3,
    {
      from: from,
      to: wphtAddr,
      useGSN: false,
      method: 'approve',
      abi: wphtSc.abi,
      params: [artistTokenAddr, amountWeiBn.toString()],
    }
  );

  const receipt = await Web3Wrapper.contractSendTx(
    web3,
    {
      from: from,
      to: artistTokenAddr,
      useGSN: false,
      method: 'mint',
      gas: 1000000,
      abi: artistTokenSc.abi,
      params: [amountWeiBn.toString()],
    }
  );

  const tokens = receipt.events['CurvedMint'].returnValues['amount'];

  console.log(`Buyer ${from} purchased ${Web3Wrapper.utils.wei2pht(tokens.toString())} ${symbol} of ArtistToken ${artistTokenAddr}`);

  return Web3Wrapper.utils.toBN(tokens);
};

module.exports.sellArtistTokens = async (web3, { from, artistTokenAddr, amountBn }) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
  Web3Wrapper.validator.validateWeiBn("amountBn", amountBn);

  const symbol = await getArtistTokenSymbol(web3, { artistTokenAddr });

  const receipt = await Web3Wrapper.contractSendTx(
    web3,
    {
      from: from,
      to: artistTokenAddr,
      useGSN: false,
      method: 'burn',
      gas: 1000000,
      abi: artistTokenSc.abi,
      params: [amountBn.toString()],
    }
  );

  const wphtReimbursement = receipt.events['CurvedBurn'].returnValues['reimbursement'];

  console.log(`Account ${from} sold ${Web3Wrapper.utils.wei2pht(amountBn.toString())} ${symbol} of ArtistToken ${artistTokenAddr} for ${Web3Wrapper.utils.wei2pht(wphtReimbursement.toString())} WPHT`);

  return wphtReimbursement;
};
