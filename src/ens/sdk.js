/**
 * User: ggarrido
 * Date: 29/08/19 11:51
 * Copyright 2019 (c) Lightstreams, Granada
 */

const ENS = require('ethereum-ens');
const ENSRegistry = require('./ENSRegistry');
const PublicResolver = require('./PublicResolver');
// const FIFSRegistrar = require('./FIFSRegistrar');
const defaultResolverNodeId = 'resolver';

module.exports.initializeManager = (provider, ensRegistryAddress) => {
  return new ENS(provider, ensRegistryAddress);
};

module.exports.deployNewRegistry = async (web3, { from }) => {
  const ensAddress = await deployRegistry(web3, { from });
  const resolverAddress = await deployResolver(web3, { from, ensAddress });

  await registerNode(web3, {
    from,
    ensAddress,
    parentNode: '0x0000000000000000000000000000000000000000',
    node: defaultResolverNodeId // Default
  });

  await setNodeResolver(web3, { from, ensAddress, resolverAddress, node: defaultResolverNodeId });
  return { ensAddress, resolverAddress };
};

module.exports.registerNode = async (web3, {ensAddress, parentNode, from, node, resolverAddress, toAddress }) => {
  // In case of not resolver defined we use parent resolver
  if(!resolverAddress) {
    resolverAddress = await ENSRegistry(web3).resolver(ensAddress,
      { node: parentNode || defaultResolverNodeId }
    );
  }

  await registerNode(web3, {
    from,
    ensAddress,
    parentNode: parentNode || '0x0000000000000000000000000000000000000000',
    node
  });

  await setNodeResolver(web3, {
    from,
    ensAddress,
    resolverAddress,
    node: parentNode ? `${node}.${parentNode}` : `${node}`
  });

  if (toAddress) {
    console.log(`Set node address to ${toAddress}....`);
    const txReceipt = await PublicResolver(web3).setAddr(resolverAddress,
      { from: from, node, address: toAddress }
    );
    if (txReceipt.status !== true) {
      console.error(txReceipt);
      throw new Error(`Failed to set resolver address.`)
    } else {
      console.log(`Successfully set "${node}" to address "${resolverAddress}"`);
    }
  }
};

// module.exports.deployTLD = async (web3, from, tld) => {
//   const ensAddress = await deployRegistry(web3, from);
//   const resolverAddress = await deployResolver(web3, from, ensAddress);
//   await registerNode(web3, from, ensAddress, tld);
//   await setNodeResolver(web3, from, ensAddress, resolverAddress, tld);
//   return ensAddress;
// };

const registerNode = async(web3, { from, ensAddress, parentNode, node }) => {
  console.log(`Registering node "${node}.${parentNode}"...`);
  const txReceipt = await ENSRegistry(web3).registerNode(ensAddress, {
    from,
    owner: from,
    parentNode,
    node
  });

  if (txReceipt.status !== true) {
    console.error(txReceipt);
    throw new Error(`Failed to register node ${node}.${parentNode}}`)
  } else {
    console.log(`Node "${node}.${parentNode}" registered successfully`);
  }
};

const setNodeResolver = async (web3, { from, node, ensAddress, resolverAddress }) => {
  console.log(`Set resolver ${resolverAddress} for "${node}"...`);
  let txReceipt = await ENSRegistry(web3).setResolver(ensAddress,
    { from, resolverAddress, node });
  if (txReceipt.status !== true) {
    console.error(txReceipt);
    throw new Error(`Failed to set resolver`)
  } else {
    console.log(`Resolver was set correctly.`)
  }
};

const deployRegistry = async (web3, { from }) => {
  console.log(`Deploying registry...`);
  const txReceipt = await ENSRegistry(web3).deploy({ from: from });
  const address = txReceipt.contractAddress;
  if (txReceipt.status !== true) {
    console.error(txReceipt);
    throw new Error(`Failed to deploy ENSRegistry ${txReceipt.transactionHash}`)
  } else {
    console.log(`ENSRegistry deployed correctly at ${address}`)
  }

  return address;
};

const deployResolver = async (web3, { from, ensAddress }) => {
  console.log(`Deploying resolver...`);
  const txReceipt = await PublicResolver(web3).deploy({ from: from, ensAddress });
  const address = txReceipt.contractAddress;
  if (txReceipt.status !== true) {
    console.error(txReceipt);
    throw new Error(`Failed to deploy PublicResolver ${txReceipt.transactionHash}`)
  } else {
    console.log(`PublicResolver deployed correctly at ${address}`)
  }

  return address;
};

//
// const deployRegistrar = async (web3, from, ensAddress, tld) => {
//   console.log(`Deploying registrar`);
//   const txReceipt = await FIFSRegistrar.web3(web3).deploy({ from: from, ensAddress, rootNode: tld });
//   console.error(txReceipt);
//   const address = txReceipt.contractAddress;
//   if (txReceipt.status !== true) {
//     throw new Error(`Failed to deploy ENSRegistry ${txReceipt.transactionHash}`)
//   } else {
//     console.log(`ENSRegistry deployed correctly at ${address}`)
//   }
//
//   return address;
// };
