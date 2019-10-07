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
// Increasing estimated gas to prevent wrong estimations
var estimatedGasThreshold = 1000;

var fetchGasPrice = function fetchGasPrice(web3) {
  return new Promise(function (resolve, reject) {
    web3.eth.getGasPrice(function (err, result) {
      if (err) reject(err);
      resolve(result.toNumber());
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

var waitFor = function waitFor(waitInSeconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

var fetchTxReceipt = function fetchTxReceipt(web3, txHash, expiredAt) {
  return new Promise(function (resolve, reject) {
    web3.eth.getTransactionReceipt(txHash,
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(err, receipt) {
        var _receipt;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!err) {
                  _context.next = 3;
                  break;
                }

                reject(err);
                return _context.abrupt("return");

              case 3:
                if (!receipt) {
                  _context.next = 6;
                  break;
                }

                resolve(receipt);
                return _context.abrupt("return");

              case 6:
                if (!(new Date().getTime() < expiredAt)) {
                  _context.next = 21;
                  break;
                }

                _context.next = 9;
                return waitFor(0.5);

              case 9:
                _context.prev = 9;
                _context.next = 12;
                return fetchTxReceipt(web3, txHash, expiredAt);

              case 12:
                _receipt = _context.sent;
                if (_receipt) resolve(_receipt);else reject(err);
                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](9);
                reject(_context.t0);

              case 19:
                _context.next = 22;
                break;

              case 21:
                reject(new Error("Transaction ".concat(txHash, " was not found")));

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 16]]);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
};

var getTxReceipt = function getTxReceipt(web3, _ref3) {
  var txHash = _ref3.txHash,
      timeoutInSec = _ref3.timeoutInSec;
  return new Promise(function (resolve, reject) {
    fetchTxReceipt(web3, txHash, new Date().getTime() + (timeoutInSec || 15) * 1000).then(function (receipt) {
      if (!receipt) {
        reject();
      }

      resolve(receipt);
    })["catch"](reject);
  });
};

var handleReceipt = function handleReceipt(web3, _ref4) {
  var txHash = _ref4.txHash,
      resolve = _ref4.resolve,
      reject = _ref4.reject;
  getTxReceipt(web3, {
    txHash: txHash
  }).then(function (txReceipt) {
    if (!txReceipt.status) {
      reject(new Error("Failed tx ".concat(txHash)));
    }

    resolve(txReceipt);
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

module.exports.getBalance = function (web3, _ref5) {
  var address = _ref5.address;
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

module.exports.deployContract = function (web3, _ref6) {
  var from = _ref6.from,
      abi = _ref6.abi,
      bytecode = _ref6.bytecode,
      params = _ref6.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var _contract$new, contract, gasPrice, contractData, estimatedGas;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              if (from && from.toLowerCase() !== window.ethereum.selectedAddress.toLowerCase()) {
                reject(new Error('From account does not match with selected address.'));
              }

              _context2.prev = 2;
              contract = web3.eth.contract(abi);
              _context2.next = 6;
              return fetchGasPrice(web3);

            case 6:
              gasPrice = _context2.sent;
              contractData = (_contract$new = contract["new"]).getData.apply(_contract$new, _toConsumableArray(params).concat([{
                data: bytecode,
                from: from
              }])); // const encodeParams = encodeConstructorParams(web3, abi, params || []);

              _context2.next = 10;
              return calculateEstimateGas(web3, {
                data: contractData
              });

            case 10:
              estimatedGas = _context2.sent;
              contract["new"].apply(contract, _toConsumableArray(params).concat([{
                from: window.ethereum.selectedAddress,
                data: bytecode,
                gas: estimatedGas + estimatedGasThreshold,
                gasPrice: gasPrice
              }, function (err, myContract) {
                if (err) {
                  reject(err);
                  return;
                } // NOTE: The callback will fire twice!
                // Once the contract has the transactionHash property set and once its deployed on an address.
                // e.g. check tx hash on the first call (transaction send)


                if (!myContract.address) {
                  handleReceipt(web3, {
                    txHash: myContract.transactionHash,
                    resolve: resolve,
                    reject: reject
                  }); // The hash of the transaction, which deploys the contract
                } // else {
                //   resolve(myContract);
                // }

              }]));
              _context2.next = 17;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](2);
              reject(_context2.t0);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 14]]);
    }));

    return function (_x3, _x4) {
      return _ref7.apply(this, arguments);
    };
  }());
};

module.exports.sendTransaction = function (web3, _ref8) {
  var to = _ref8.to,
      value = _ref8.value;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref9 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(resolve, reject) {
      var gasPrice;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              _context3.next = 3;
              return fetchGasPrice(web3);

            case 3:
              gasPrice = _context3.sent;
              window.eth.sendTransaction({
                from: window.ethereum.selectedAddress,
                value: value,
                gas: 21000,
                gasPrice: gasPrice
              }, function (err, txHash) {
                if (err) {
                  reject(err);
                }

                handleReceipt(web3, {
                  txHash: txHash,
                  resolve: resolve,
                  reject: reject
                });
              });

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5, _x6) {
      return _ref9.apply(this, arguments);
    };
  }());
};

module.exports.contractCall = function (web3, _ref10) {
  var contractAddr = _ref10.to,
      abi = _ref10.abi,
      method = _ref10.method,
      params = _ref10.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref11 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(resolve, reject) {
      var _contractInstance$met;

      var contract, contractInstance;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              contract = window.web3.eth.contract(abi);
              contractInstance = contract.at(contractAddr); // const callData = contractInstance[method].getData(...params);
              // window.web3.eth.call({ to: address, data: callData }, (err, result) => {
              //   debugger;
              //   if (err) reject(err);
              //   resolve(result);
              // });

              if (!(typeof contractInstance[method] === 'undefined')) {
                _context4.next = 5;
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
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x7, _x8) {
      return _ref11.apply(this, arguments);
    };
  }());
};

module.exports.contractSendTx = function (web3, _ref12) {
  var contractAddr = _ref12.to,
      from = _ref12.from,
      abi = _ref12.abi,
      method = _ref12.method,
      params = _ref12.params,
      value = _ref12.value;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref13 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(resolve, reject) {
      var _contractInstance$met3;

      var contract, contractInstance, gasPrice, estimatedGas;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!web3.isConnected()) {
                reject(new Error('Web3 is not connected'));
              }

              contract = web3.eth.contract(abi);
              contractInstance = contract.at(contractAddr);

              if (!(typeof contractInstance[method] === 'undefined')) {
                _context5.next = 5;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 5:
              _context5.next = 7;
              return fetchGasPrice(web3);

            case 7:
              gasPrice = _context5.sent;
              _context5.next = 10;
              return new Promise(function (resolve, reject) {
                var _contractInstance$met2;

                (_contractInstance$met2 = contractInstance[method]).estimateGas.apply(_contractInstance$met2, _toConsumableArray(params).concat([{
                  from: from,
                  value: value
                }, function (err, data) {
                  if (err) reject(err); // if (err) resolve(9000000);
                  else resolve(data);
                }]));
              });

            case 10:
              estimatedGas = _context5.sent;

              (_contractInstance$met3 = contractInstance[method]).sendTransaction.apply(_contractInstance$met3, _toConsumableArray(params).concat([{
                from: from,
                gas: estimatedGas + estimatedGasThreshold,
                value: value,
                gasPrice: gasPrice
              }, function (err, txHash) {
                if (err) reject(err);
                handleReceipt(web3, {
                  txHash: txHash,
                  resolve: resolve,
                  reject: reject
                });
              }]));

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x9, _x10) {
      return _ref13.apply(this, arguments);
    };
  }());
};

module.exports.getTxReceipt = getTxReceipt;