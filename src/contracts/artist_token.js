/**
 * User: llukac<lukas@lightstreams.io>
 * Date: 14/10/19 13:40
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3Wrapper = require('../web3');
const Debug = require('debug');

const artistTokenSc = require('../../build/contracts/ArtistToken.json');
const fundingPoolSc = require('../../build/contracts/FundingPool.json');
const wphtSc = require('../../build/contracts/WPHT.json');
const logger = Debug('ls-sdk:contract:artistToken');

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

  logger(`FundingPool deployed at: ${receipt.contractAddress}`);

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

  if (symbol && !(symbol.length === 3 || symbol.length === 4)) {
    throw new Error(`Invalid argument "symbol": "${symbol}". Expected a 3-4 char artist symbol`);
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
        [
          gasPrice, theta, p0, Web3Wrapper.utils.toWei(`${initialRaise}`),
          friction, hatchDurationSeconds, hatchVestingDurationSeconds, minExternalContribution
        ],
        reserveRatio
      ]
    }
  );

  logger(`ArtistToken deployed at: ${receipt.contractAddress}`);
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

  logger(`ArtistToken ${artistTokenAddr} is hatched: ${isHatched}`);

  return isHatched;
};

module.exports.hatchArtistToken = async (web3, { from, artistTokenAddr, wphtAddr, amountWeiBn }, runDepositFirst = false) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
  Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);

  const hatchingAmountInPHT = Web3Wrapper.utils.toPht(amountWeiBn);
  logger(`Hatcher ${from} sent a hatch worth of ${hatchingAmountInPHT} PHT to artist token ${artistTokenAddr}`);
  if (runDepositFirst) {
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

  const receipt = await Web3Wrapper.contractSendTx(
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

  const expectedArtistTokens = await expectedArtistTokenOfHatchContribution(web3, {
    artistTokenAddr,
    contributionInWPHT: hatchingAmountInPHT
  });

  logger(`Hatched completed, expected ${expectedArtistTokens} ArtistTokens`);
  return receipt;
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

  logger(`ArtistToken ${artistTokenAddr} total supply is: ${Web3Wrapper.utils.wei2pht(totalSupply)} PHT`);

  return totalSupply;
};

module.exports.claimTokens = async (web3, { artistTokenAddr, from }) => {
  return await Web3Wrapper.contractSendTx(
    web3,
    {
      to: artistTokenAddr,
      from: from,
      useGSN: false,
      method: 'claimTokens',
      gas: 1000000,
      abi: artistTokenSc.abi,
    }
  );
};

module.exports.transfer = async (web3, { artistTokenAddr, from, to, amountInBn }) => {
  return await Web3Wrapper.contractSendTx(
    web3,
    {
      to: artistTokenAddr,
      from: from,
      method: 'transfer',
      gas: 1000000,
      abi: artistTokenSc.abi,
      params: [to, amountInBn.toString()]
    }
  );
};

module.exports.transferOwnership = async (web3, {artistTokenAddr, from, newOwnerAddr}) => {
  return await Web3Wrapper.contractSendTx(
      web3,
      {
        to: artistTokenAddr,
        from: from,
        method: 'transferOwnership',
        abi: artistTokenSc.abi,
        params: [newOwnerAddr]
      }
  );
};

module.exports.approve = async (web3, { artistTokenAddr, from, to, amountInBn }) => {
  return await Web3Wrapper.contractSendTx(
    web3,
    {
      from: from,
      to: artistTokenAddr,
      method: 'approve',
      abi: wphtSc.abi,
      params: [to, amountInBn.toString()],
    }
  );
};

module.exports.getBalanceOf = async (web3, { artistTokenAddr, accountAddr }) => {
  return await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      method: 'balanceOf',
      abi: artistTokenSc.abi,
      params: [accountAddr],
    }
  );
};

module.exports.getPoolBalance = async (web3, { artistTokenAddr }) => {
  return await Web3Wrapper.contractCall(
    web3,
    {
      to: artistTokenAddr,
      method: 'poolBalance',
      abi: artistTokenSc.abi,
      params: [],
    }
  );
};

module.exports.getRaisedExternalInWPHT = async (web3, { artistTokenAddr }) => {
  return await Web3Wrapper.contractCall(web3, {
      to: artistTokenAddr,
      method: 'raisedExternal',
      abi: artistTokenSc.abi,
      params: [],
  }).then(amountInWei => {
    return Web3Wrapper.utils.toPht(amountInWei);
  });
};

module.exports.getWPHTHatchContributionOf = async (web3, { artistTokenAddr, accountAddr }) => {
  const preHatchContribution = await Web3Wrapper.contractCall(web3, {
    to: artistTokenAddr,
    abi: artistTokenSc.abi,
    method: 'initialContributions',
    params: [accountAddr]
  });

  return Web3Wrapper.utils.toPht(preHatchContribution.paidExternal);
};

module.exports.getInitialRaiseInWPHT = async (web3, { artistTokenAddr }) => {
  const initialRaise = await Web3Wrapper.contractCall(web3, {
    to: artistTokenAddr,
    abi: artistTokenSc.abi,
    method: 'initialRaise',
    params: []
  });

  return Web3Wrapper.utils.toPht(initialRaise);
};

const expectedArtistTokenOfHatchContribution = async (web3, { artistTokenAddr, contributionInWPHT }) => {
  const p0 = await Web3Wrapper.contractCall(web3, {
    to: artistTokenAddr,
    abi: artistTokenSc.abi,
    method: 'p0',
    params: []
  });

  const theta = await Web3Wrapper.contractCall(web3, {
    to: artistTokenAddr,
    abi: artistTokenSc.abi,
    method: 'theta',
    params: []
  });

  const DENOMINATOR_PPM = 1000000;
  return parseFloat(contributionInWPHT) * parseFloat(p0) * (1.0 - (parseInt(theta) / DENOMINATOR_PPM));
};

module.exports.expectedArtistTokenOfHatchContribution = expectedArtistTokenOfHatchContribution;

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

  logger(`Account ${accountAddr} has ${Web3Wrapper.utils.wei2pht(balance.toString())} ${symbol} of ArtistToken ${artistTokenAddr}`);

  return Web3Wrapper.utils.toBN(balance);
};

module.exports.buyArtistTokens = async (web3, { from, artistTokenAddr, wphtAddr, amountWeiBn }, runDepositFirst = false) => {
  Web3Wrapper.validator.validateAddress("from", from);
  Web3Wrapper.validator.validateAddress("artistTokenAddr", artistTokenAddr);
  Web3Wrapper.validator.validateAddress("wphtAddr", wphtAddr);
  Web3Wrapper.validator.validateWeiBn("amountWeiBn", amountWeiBn);

  const symbol = await getArtistTokenSymbol(web3, { artistTokenAddr });

  if (runDepositFirst) {
    await Web3Wrapper.contractSendTx(
      web3,
      {
        from: from,
        to: wphtAddr,
        value: amountWeiBn.toString(),
        method: 'deposit',
        abi: wphtSc.abi,
        params: [],
      }
    );
  }

  await Web3Wrapper.contractSendTx(
    web3,
    {
      from: from,
      to: wphtAddr,
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
      method: 'mint',
      gas: 1000000,
      abi: artistTokenSc.abi,
      params: [amountWeiBn.toString()],
    }
  );

  const tokens = receipt.events['CurvedMint'].returnValues['amount'];

  logger(`Buyer ${from} purchased ${tokens.toString()} ${symbol} of ArtistToken ${artistTokenAddr}`);

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

  logger(`Account ${from} sold ${Web3Wrapper.utils.wei2pht(amountBn.toString())} ${symbol} of ArtistToken ${artistTokenAddr} for ${Web3Wrapper.utils.wei2pht(wphtReimbursement.toString())} WPHT`);

  return wphtReimbursement;
};
