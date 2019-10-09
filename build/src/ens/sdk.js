"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

module.exports.deployNewRegistry =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, _ref) {
    var from, ensAddress, resolverAddress;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            from = _ref.from;
            _context.next = 3;
            return deployRegistry(web3, {
              from: from
            });

          case 3:
            ensAddress = _context.sent;
            _context.next = 6;
            return initializeNewRegistry(web3, {
              from: from,
              ensAddress: ensAddress
            });

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
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports.initializeNewRegistry =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(web3, _ref3) {
    var from, ensAddress, resolverAddress;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref3.from, ensAddress = _ref3.ensAddress;
            _context2.next = 3;
            return deployResolver(web3, {
              from: from,
              ensAddress: ensAddress
            });

          case 3:
            resolverAddress = _context2.sent;
            _context2.next = 6;
            return registerNode(web3, {
              from: from,
              ensAddress: ensAddress,
              subnode: defaultResolverNodeId // Default

            });

          case 6:
            _context2.next = 8;
            return setNodeResolver(web3, {
              from: from,
              ensAddress: ensAddress,
              resolverAddress: resolverAddress,
              node: defaultResolverNodeId
            });

          case 8:
            return _context2.abrupt("return", {
              resolverAddress: resolverAddress
            });

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

module.exports.registerNode =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(web3, _ref5) {
    var ensAddress, parentNode, from, subnode, resolverAddress, toAddress, txReceipt;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ensAddress = _ref5.ensAddress, parentNode = _ref5.parentNode, from = _ref5.from, subnode = _ref5.subnode, resolverAddress = _ref5.resolverAddress, toAddress = _ref5.toAddress;

            if (resolverAddress) {
              _context3.next = 5;
              break;
            }

            _context3.next = 4;
            return ENSRegistry(web3).resolver(ensAddress, {
              node: parentNode || defaultResolverNodeId
            });

          case 4:
            resolverAddress = _context3.sent;

          case 5:
            _context3.next = 7;
            return registerNode(web3, {
              from: from,
              ensAddress: ensAddress,
              parentNode: parentNode,
              subnode: subnode
            });

          case 7:
            _context3.next = 9;
            return setNodeResolver(web3, {
              from: from,
              ensAddress: ensAddress,
              resolverAddress: resolverAddress,
              node: parentNode ? "".concat(subnode, ".").concat(parentNode) : "".concat(subnode)
            });

          case 9:
            if (!toAddress) {
              _context3.next = 20;
              break;
            }

            console.log("Set node address to ".concat(toAddress, "...."));
            _context3.next = 13;
            return PublicResolver(web3).setAddr(resolverAddress, {
              from: from,
              node: subnode,
              address: toAddress
            });

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
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}(); // module.exports.deployTLD = async (web3, from, tld) => {
//   const ensAddress = await deployRegistry(web3, from);
//   const resolverAddress = await deployResolver(web3, from, ensAddress);
//   await registerNode(web3, from, ensAddress, tld);
//   await setNodeResolver(web3, from, ensAddress, resolverAddress, tld);
//   return ensAddress;
// };


var registerNode =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(web3, _ref7) {
    var from, ensAddress, parentNode, subnode, txReceipt;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            from = _ref7.from, ensAddress = _ref7.ensAddress, parentNode = _ref7.parentNode, subnode = _ref7.subnode;
            parentNode = parentNode || '0x0000000000000000000000000000000000000000';
            console.log("Registering node \"".concat(subnode, ".").concat(parentNode, "\"..."));
            _context4.next = 5;
            return ENSRegistry(web3).registerNode(ensAddress, {
              from: from,
              owner: from,
              parentNode: parentNode,
              subnode: subnode
            });

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
    }, _callee4);
  }));

  return function registerNode(_x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}();

var setNodeResolver =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(web3, _ref9) {
    var from, node, ensAddress, resolverAddress, fetchedOwner, txReceipt;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            from = _ref9.from, node = _ref9.node, ensAddress = _ref9.ensAddress, resolverAddress = _ref9.resolverAddress;
            console.log("Set resolver ".concat(resolverAddress, " for \"").concat(node, "\"..."));
            _context5.next = 4;
            return ENSRegistry(web3).owner(ensAddress, {
              node: node
            });

          case 4:
            fetchedOwner = _context5.sent;

            if (!(fetchedOwner.toLowerCase() !== from.toLowerCase())) {
              _context5.next = 7;
              break;
            }

            throw new Error("Invalid node owner ".concat(fetchedOwner));

          case 7:
            _context5.next = 9;
            return ENSRegistry(web3).setResolver(ensAddress, {
              from: from,
              resolverAddress: resolverAddress,
              node: node
            });

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
    }, _callee5);
  }));

  return function setNodeResolver(_x9, _x10) {
    return _ref10.apply(this, arguments);
  };
}();

var deployRegistry =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(web3, _ref11) {
    var from, txReceipt, address;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            from = _ref11.from;
            console.log("Deploying registry...");
            _context6.next = 4;
            return ENSRegistry(web3).deploy({
              from: from
            });

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
    }, _callee6);
  }));

  return function deployRegistry(_x11, _x12) {
    return _ref12.apply(this, arguments);
  };
}();

var deployResolver =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(web3, _ref13) {
    var from, ensAddress, txReceipt, address;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            from = _ref13.from, ensAddress = _ref13.ensAddress;
            console.log("Deploying resolver...");
            _context7.next = 4;
            return PublicResolver(web3).deploy({
              from: from,
              ensAddress: ensAddress
            });

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
    }, _callee7);
  }));

  return function deployResolver(_x13, _x14) {
    return _ref14.apply(this, arguments);
  };
}();

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