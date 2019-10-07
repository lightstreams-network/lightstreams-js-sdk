"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * User: ggarrido
 * Date: 5/08/19 15:45
 * Copyright 2019 (c) Lightstreams, Granada
 */
var Web3 = require('web3');

var net = require('net'); // Increasing estimated gas to prevent wrong estimations


var gasThreshold = 200000;
var defaultCfg = {
  provider: process.env.WEB3_PROVIDER || 'http://locahost:8545',
  gasPrice: process.env.WEB3_GAS_PRICE || 500000000000
}; // const logParser = function(web3, { logs, abi }) {
//   return logs.map(function(log) {
//     // return decoders.find(function(decoder) {
//     //   return (decoder.signature() == log.topics[0].replace("0x", ""));
//     // }).decode(log);
//     return web3.eth.abi.decodeLog([{
//       type: 'string',
//       name: 'myString'
//     }, {
//       type: 'uint256',
//       name: 'myNumber',
//       indexed: true
//     }, {
//       type: 'uint8',
//       name: 'mySmallNumber',
//       indexed: true
//     }], log.data, log.topics[0].replace("0x", ""));
//   })
// };

var waitFor = function waitFor(waitInSeconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, waitInSeconds * 1000);
  });
};

var fetchTxReceipt =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, txHash, expiredAt) {
    var receipt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return web3.eth.getTransactionReceipt(txHash);

          case 2:
            receipt = _context.sent;

            if (!(!receipt && new Date().getTime() < expiredAt)) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return waitFor(0.5);

          case 6:
            return _context.abrupt("return", fetchTxReceipt(web3, txHash, expiredAt));

          case 7:
            return _context.abrupt("return", receipt);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchTxReceipt(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var getTxReceipt = function getTxReceipt(web3, _ref2) {
  var txHash = _ref2.txHash,
      timeoutInSec = _ref2.timeoutInSec;
  return new Promise(function (resolve, reject) {
    fetchTxReceipt(web3, txHash, new Date().getTime() + (timeoutInSec || 15) * 1000).then(function (receipt) {
      if (!receipt) {
        reject(new Error("Cannot fetch tx receipt ".concat(txHash)));
      }

      resolve(receipt);
    })["catch"](reject);
  });
};

var handleReceipt = function handleReceipt(web3, _ref3) {
  var txHash = _ref3.txHash,
      resolve = _ref3.resolve,
      reject = _ref3.reject;
  getTxReceipt(web3, {
    txHash: txHash
  }).then(function (txReceipt) {
    if (!txReceipt.status) {
      reject(new Error("Failed tx ".concat(txHash)));
    }

    resolve(txReceipt);
  });
};

var calculateEstimatedGas = function calculateEstimatedGas(method, params) {
  return new Promise(function (resolve, reject) {
    method.estimateGas(params, function (err, estimatedGas) {
      if (err) reject(err); // if (err) {
      //   debugger;
      //   resolve(9000000);
      // }
      else {
          var gas = estimatedGas + gasThreshold;
          resolve(gas);
        }
    });
  });
};

module.exports.initialize =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(provider) {
    var options,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            return _context3.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref5 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(resolve, reject) {
                var web3;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        try {
                          web3 = new Web3(provider || defaultCfg.provider, net, {
                            defaultGasPrice: options.gasPrice || defaultCfg.gasPrice
                          });
                          resolve(web3);
                        } catch (err) {
                          reject(err);
                        }

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5, _x6) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}();

module.exports.networkVersion = function (web3) {
  return new Promise(function (resolve, reject) {
    web3.eth.net.getId(function (err, netId) {
      if (err) reject(err);
      resolve(netId);
    });
  });
};

module.exports.getTxReceipt = getTxReceipt;

module.exports.getBalance = function (web3, _ref6) {
  var address = _ref6.address;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(resolve, reject) {
      var balance;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return web3.eth.getBalance(address);

            case 3:
              balance = _context4.sent;
              resolve(balance);
              _context4.next = 10;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              reject(_context4.t0);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 7]]);
    }));

    return function (_x7, _x8) {
      return _ref7.apply(this, arguments);
    };
  }());
};

module.exports.sendRawTransaction = function (web3, rawSignedTx) {
  return new Promise(function (resolve, reject) {
    web3.eth.sendSignedTransaction(rawSignedTx, function (err, txHash) {
      if (err) {
        reject(err);
      }

      handleReceipt(web3, {
        txHash: txHash,
        resolve: resolve,
        reject: reject
      });
    });
  });
};

module.exports.sendTransaction = function (web3, _ref8) {
  var from = _ref8.from,
      to = _ref8.to,
      valueInPht = _ref8.valueInPht;
  return new Promise(function (resolve, reject) {
    web3.eth.sendTransaction({
      from: from,
      to: to,
      value: web3.utils.toWei(valueInPht, "ether")
    }).on('transactionHash', function (txHash) {
      handleReceipt(web3, {
        txHash: txHash,
        resolve: resolve,
        reject: reject
      });
    }).on('error', reject);
  });
};

module.exports.contractCall = function (web3, contractAddress, _ref9) {
  var abi = _ref9.abi,
      from = _ref9.from,
      method = _ref9.method,
      params = _ref9.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref10 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(resolve, reject) {
      var _contract$methods, contract, result;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              contract = new web3.eth.Contract(abi, contractAddress);

              if (!(typeof contract.methods[method] !== 'function')) {
                _context5.next = 4;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 4:
              _context5.next = 6;
              return (_contract$methods = contract.methods)[method].apply(_contract$methods, _toConsumableArray(params)).call({
                from: from
              });

            case 6:
              result = _context5.sent;
              resolve(result);
              _context5.next = 13;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](0);
              reject(_context5.t0);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 10]]);
    }));

    return function (_x9, _x10) {
      return _ref10.apply(this, arguments);
    };
  }());
};

module.exports.contractSendTx = function (web3, contractAddress, _ref11) {
  var abi = _ref11.abi,
      from = _ref11.from,
      method = _ref11.method,
      params = _ref11.params,
      value = _ref11.value;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref12 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(resolve, reject) {
      var _contract$methods2, contract, sendTx, estimatedGas;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              contract = new web3.eth.Contract(abi, contractAddress);

              if (!(typeof contract.methods[method] !== 'function')) {
                _context6.next = 4;
                break;
              }

              throw new Error("Method ".concat(method, " is not available"));

            case 4:
              sendTx = (_contract$methods2 = contract.methods)[method].apply(_contract$methods2, _toConsumableArray(params));
              _context6.next = 7;
              return calculateEstimatedGas(sendTx, {
                from: from,
                value: value
              });

            case 7:
              estimatedGas = _context6.sent;
              sendTx.send({
                from: from,
                value: value,
                gas: estimatedGas
              }).on('transactionHash', function (txHash) {
                console.log("Tx executed ".concat(txHash));
              }).on('receipt', function (txReceipt) {
                if (!txReceipt.status) {
                  reject(new Error("Failed tx ".concat(txReceipt.hash)));
                }

                resolve(txReceipt);
              }).on('error', reject);
              _context6.next = 14;
              break;

            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](0);
              reject(_context6.t0);

            case 14:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 11]]);
    }));

    return function (_x11, _x12) {
      return _ref12.apply(this, arguments);
    };
  }());
};

module.exports.deployContract = function (web3, _ref13) {
  var from = _ref13.from,
      abi = _ref13.abi,
      bytecode = _ref13.bytecode,
      params = _ref13.params;
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref14 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(resolve, reject) {
      var contract, contractDeploy, estimatedGas;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              contract = new web3.eth.Contract(abi);
              contractDeploy = contract.deploy({
                data: bytecode,
                arguments: params || []
              });
              _context7.next = 5;
              return calculateEstimatedGas(contractDeploy, {
                from: from
              });

            case 5:
              estimatedGas = _context7.sent;
              contractDeploy.send({
                from: from,
                gas: estimatedGas
              }).on('transactionHash', function (txHash) {
                console.log("Tx executed ".concat(txHash));
              }).on('receipt', function (txReceipt) {
                if (!txReceipt.status) {
                  reject(new Error("Failed tx ".concat(txReceipt.hash)));
                }

                resolve(txReceipt);
              }).on('error', reject);
              _context7.next = 12;
              break;

            case 9:
              _context7.prev = 9;
              _context7.t0 = _context7["catch"](0);
              reject(_context7.t0);

            case 12:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 9]]);
    }));

    return function (_x13, _x14) {
      return _ref14.apply(this, arguments);
    };
  }());
};