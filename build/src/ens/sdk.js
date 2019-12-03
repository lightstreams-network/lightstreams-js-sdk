"use strict";

/**
 * User: ggarrido
 * Date: 29/08/19 11:51
 * Copyright 2019 (c) Lightstreams, Granada
 */
var ENS = require('ethereum-ens');

var ENSRegistry = require('./ENSRegistry');

var PublicResolver = require('./PublicResolver'); // const FIFSRegistrar = require('./FIFSRegistrar');


var defaultResolverNodeId = 'resolver';

module.exports.initializeManager = function (provider, ensRegistryAddress) {
  return new ENS(provider, ensRegistryAddress);
};

module.exports.deployNewRegistry = function _callee(web3, _ref) {
  var from, ensAddress, resolverAddress;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          from = _ref.from;
          _context.next = 3;
          return regeneratorRuntime.awrap(deployRegistry(web3, {
            from: from
          }));

        case 3:
          ensAddress = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(initializeNewRegistry(web3, {
            from: from,
            ensAddress: ensAddress
          }));

        case 6:
          resolverAddress = _context.sent;
          return _context.abrupt("return", {
            ensAddress: ensAddress,
            resolverAddress: resolverAddress
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.initializeNewRegistry = function _callee2(web3, _ref2) {
  var from, ensAddress, resolverAddress;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          from = _ref2.from, ensAddress = _ref2.ensAddress;
          _context2.next = 3;
          return regeneratorRuntime.awrap(deployResolver(web3, {
            from: from,
            ensAddress: ensAddress
          }));

        case 3:
          resolverAddress = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(registerNode(web3, {
            from: from,
            ensAddress: ensAddress,
            subnode: defaultResolverNodeId // Default

          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(setNodeResolver(web3, {
            from: from,
            ensAddress: ensAddress,
            resolverAddress: resolverAddress,
            node: defaultResolverNodeId
          }));

        case 8:
          return _context2.abrupt("return", {
            resolverAddress: resolverAddress
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.registerNode = function _callee3(web3, _ref3) {
  var ensAddress, parentNode, from, subnode, resolverAddress, toAddress, txReceipt;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          ensAddress = _ref3.ensAddress, parentNode = _ref3.parentNode, from = _ref3.from, subnode = _ref3.subnode, resolverAddress = _ref3.resolverAddress, toAddress = _ref3.toAddress;

          if (resolverAddress) {
            _context3.next = 5;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(ENSRegistry(web3).resolver(ensAddress, {
            node: parentNode || defaultResolverNodeId
          }));

        case 4:
          resolverAddress = _context3.sent;

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(registerNode(web3, {
            from: from,
            ensAddress: ensAddress,
            parentNode: parentNode,
            subnode: subnode
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(setNodeResolver(web3, {
            from: from,
            ensAddress: ensAddress,
            resolverAddress: resolverAddress,
            node: parentNode ? "".concat(subnode, ".").concat(parentNode) : "".concat(subnode)
          }));

        case 9:
          if (!toAddress) {
            _context3.next = 20;
            break;
          }

          console.log("Set node address to ".concat(toAddress, "...."));
          _context3.next = 13;
          return regeneratorRuntime.awrap(PublicResolver(web3).setAddr(resolverAddress, {
            from: from,
            node: subnode,
            address: toAddress
          }));

        case 13:
          txReceipt = _context3.sent;

          if (!(txReceipt.status !== true)) {
            _context3.next = 19;
            break;
          }

          console.error(txReceipt);
          throw new Error("Failed to set resolver address.");

        case 19:
          console.log("Successfully set \"".concat(subnode, "\" to address \"").concat(resolverAddress, "\""));

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // module.exports.deployTLD = async (web3, from, tld) => {
//   const ensAddress = await deployRegistry(web3, from);
//   const resolverAddress = await deployResolver(web3, from, ensAddress);
//   await registerNode(web3, from, ensAddress, tld);
//   await setNodeResolver(web3, from, ensAddress, resolverAddress, tld);
//   return ensAddress;
// };


var registerNode = function registerNode(web3, _ref4) {
  var from, ensAddress, parentNode, subnode, txReceipt;
  return regeneratorRuntime.async(function registerNode$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          from = _ref4.from, ensAddress = _ref4.ensAddress, parentNode = _ref4.parentNode, subnode = _ref4.subnode;
          parentNode = parentNode || '0x0000000000000000000000000000000000000000';
          console.log("Registering node \"".concat(subnode, ".").concat(parentNode, "\"..."));
          _context4.next = 5;
          return regeneratorRuntime.awrap(ENSRegistry(web3).registerNode(ensAddress, {
            from: from,
            owner: from,
            parentNode: parentNode,
            subnode: subnode
          }));

        case 5:
          txReceipt = _context4.sent;

          if (!(txReceipt.status !== true)) {
            _context4.next = 11;
            break;
          }

          console.error(txReceipt);
          throw new Error("Failed to register node ".concat(subnode, ".").concat(parentNode, "}"));

        case 11:
          console.log("Node \"".concat(subnode, ".").concat(parentNode, "\" registered successfully (").concat(txReceipt.cumulativeGasUsed, " usedGas)"));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var setNodeResolver = function setNodeResolver(web3, _ref5) {
  var from, node, ensAddress, resolverAddress, fetchedOwner, txReceipt;
  return regeneratorRuntime.async(function setNodeResolver$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          from = _ref5.from, node = _ref5.node, ensAddress = _ref5.ensAddress, resolverAddress = _ref5.resolverAddress;
          console.log("Set resolver ".concat(resolverAddress, " for \"").concat(node, "\"..."));
          _context5.next = 4;
          return regeneratorRuntime.awrap(ENSRegistry(web3).owner(ensAddress, {
            node: node
          }));

        case 4:
          fetchedOwner = _context5.sent;

          if (!(fetchedOwner.toLowerCase() !== from.toLowerCase())) {
            _context5.next = 7;
            break;
          }

          throw new Error("Invalid node owner ".concat(fetchedOwner));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(ENSRegistry(web3).setResolver(ensAddress, {
            from: from,
            resolverAddress: resolverAddress,
            node: node
          }));

        case 9:
          txReceipt = _context5.sent;

          if (!(txReceipt.status !== true)) {
            _context5.next = 15;
            break;
          }

          console.error(txReceipt);
          throw new Error("Failed to set resolver");

        case 15:
          console.log("Resolver was set correctly. (".concat(txReceipt.cumulativeGasUsed, " usedGas)"));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var deployRegistry = function deployRegistry(web3, _ref6) {
  var from, txReceipt, address;
  return regeneratorRuntime.async(function deployRegistry$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          from = _ref6.from;
          console.log("Deploying registry...");
          _context6.next = 4;
          return regeneratorRuntime.awrap(ENSRegistry(web3).deploy({
            from: from
          }));

        case 4:
          txReceipt = _context6.sent;
          address = txReceipt.contractAddress;

          if (!(txReceipt.status !== true)) {
            _context6.next = 11;
            break;
          }

          console.error(txReceipt);
          throw new Error("Failed to deploy ENSRegistry ".concat(txReceipt.transactionHash));

        case 11:
          console.log("ENSRegistry deployed correctly at ".concat(address, " (").concat(txReceipt.cumulativeGasUsed, " usedGas)"));

        case 12:
          return _context6.abrupt("return", address);

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var deployResolver = function deployResolver(web3, _ref7) {
  var from, ensAddress, txReceipt, address;
  return regeneratorRuntime.async(function deployResolver$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          from = _ref7.from, ensAddress = _ref7.ensAddress;
          console.log("Deploying resolver...");
          _context7.next = 4;
          return regeneratorRuntime.awrap(PublicResolver(web3).deploy({
            from: from,
            ensAddress: ensAddress
          }));

        case 4:
          txReceipt = _context7.sent;
          address = txReceipt.contractAddress;

          if (!(txReceipt.status !== true)) {
            _context7.next = 11;
            break;
          }

          console.error(txReceipt);
          throw new Error("Failed to deploy PublicResolver ".concat(txReceipt.transactionHash));

        case 11:
          console.log("PublicResolver deployed correctly at ".concat(address));

        case 12:
          return _context7.abrupt("return", address);

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var waitFor = function waitFor(waitInSeconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, waitInSeconds * 1000);
  });
}; //
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