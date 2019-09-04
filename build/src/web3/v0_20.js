"use strict";

var _this = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 14/08/19 15:56
 * Copyright 2019 (c) Lightstreams, Granada
 */
var fetchGasPrice = function fetchGasPrice(web3) {
  return new Promise(function (resolve, reject) {
    web3.eth.getGasPrice(function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

var calculateEstimateGas = function calculateEstimateGas(web3, _ref) {
  var data = _ref.data,
      to = _ref.to;
  return new Promise(function (resolve, reject) {
    web3.eth.estimateGas({
      data: data,
      to: to
    }, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.networkVersion = function (web3) {
  return new Promise(function (resolve, reject) {
    web3.version.getNetwork(function (err, netId) {
      if (err) reject(err);
      resolve(parseInt(netId));
    });
  });
};

module.exports.getBalance = function (web3, _ref2) {
  var address = _ref2.address;
  return new Promise(function (resolve, reject) {
    if (!_this.isConnected()) {
      reject(new Error('Web3 is not connected'));
    }

    web3.getBalance(address, function (err, balance) {
      if (err) {
        reject(err);
      }

      resolve(balance);
    });
  });
};

module.exports.deployContract = function (web3, _ref3) {
  var abi = _ref3.abi,
      bytecode = _ref3.bytecode,
      params = _ref3.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var contract, gasPrice, estimatedGas;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              contract = web3.eth.contract(abi);
              _context.next = 4;
              return fetchGasPrice(web3);

            case 4:
              gasPrice = _context.sent;
              _context.next = 7;
              return calculateEstimateGas(web3, {
                data: bytecode
              });

            case 7:
              estimatedGas = _context.sent;
              contract["new"].apply(contract, _toConsumableArray(params).concat([{
                from: window.ethereum.selectedAddress,
                data: bytecode,
                gas: estimatedGas,
                gasPrice: gasPrice
              }, function (err, myContract) {
                if (err) {
                  reject(err);
                  return;
                } // NOTE: The callback will fire twice!
                // Once the contract has the transactionHash property set and once its deployed on an address.
                // e.g. check tx hash on the first call (transaction send)


                if (!myContract.address) {
                  resolve(myContract.transactionHash); // The hash of the transaction, which deploys the contract
                } // else {
                //   resolve(myContract);
                // }

              }]));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }());
};

module.exports.sendRawTransaction = function (web3, rawSignedTx) {
  throw new Error('Missing implementation');
};

module.exports.sendTransaction = function (web3, _ref5) {
  var to = _ref5.to,
      value = _ref5.value;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var gasPrice;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              _context2.next = 3;
              return fetchGasPrice(web3);

            case 3:
              gasPrice = _context2.sent;
              window.eth.sendTransaction({
                from: window.ethereum.selectedAddress,
                value: value,
                gas: 21000,
                gasPrice: gasPrice
              }, function (err, result) {
                if (err) {
                  reject(err);
                }

                resolve(result);
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3, _x4) {
      return _ref6.apply(this, arguments);
    };
  }());
};

module.exports.contractCall = function (web3, contractAddress, _ref7) {
  var abi = _ref7.abi,
      method = _ref7.method,
      params = _ref7.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref8 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(resolve, reject) {
      var _contractInstance$met;

      var contract, contractInstance;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              contract = window.web3.eth.contract(abi);
              contractInstance = contract.at(contractAddress); // const callData = contractInstance[method].getData(...params);
              // window.web3.eth.call({ to: address, data: callData }, (err, result) => {
              //   debugger;
              //   if (err) reject(err);
              //   resolve(result);
              // });

              if (!(typeof contractInstance[method] === 'undefined')) {
                _context3.next = 5;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 5:
              (_contractInstance$met = contractInstance[method]).call.apply(_contractInstance$met, _toConsumableArray(params).concat([function (err, result) {
                if (err) reject(err);
                resolve(result);
              }]));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5, _x6) {
      return _ref8.apply(this, arguments);
    };
  }());
};

module.exports.contractSendTx = function (web3, contractAddress, _ref9) {
  var abi = _ref9.abi,
      method = _ref9.method,
      params = _ref9.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref10 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(resolve, reject) {
      var contract, contractInstance, estimatedGas, gasPrice;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              contract = web3.eth.contract(abi);
              contractInstance = contract.at(contractAddress);

              if (!(typeof contractInstance[method] === 'undefined')) {
                _context4.next = 5;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 5:
              _context4.next = 7;
              return new Promise(function (resolve, reject) {
                var _contractInstance$met2;

                (_contractInstance$met2 = contractInstance[method]).estimateGas.apply(_contractInstance$met2, _toConsumableArray(params).concat([function (err, data) {
                  if (err) reject(err);else resolve(data);
                }]));
              });

            case 7:
              estimatedGas = _context4.sent;
              _context4.next = 10;
              return fetchGasPrice(web3);

            case 10:
              gasPrice = _context4.sent;
              contractInstance[method].apply(contractInstance, _toConsumableArray(params).concat([{
                from: window.ethereum.selectedAddress,
                gas: estimatedGas,
                gasPrice: gasPrice
              }, function (err, txHash) {
                if (err) reject(err);
                resolve(txHash);
              }]));

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x7, _x8) {
      return _ref10.apply(this, arguments);
    };
  }());
};

module.exports.getTxReceipt = function (web3, _ref11) {
  var txHash = _ref11.txHash,
      timeoutInSec = _ref11.timeoutInSec;
  throw new Error('Missing implementation');
};