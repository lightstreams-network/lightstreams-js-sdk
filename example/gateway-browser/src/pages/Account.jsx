/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Lightwallet as lw } from 'lightstreams-js-sdk';

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // seedPhrase: lw.Keystore.generateRandomSeed(),
      seedPhrase: 'guess tonight return rude vast goat shadow grant comfort december uniform bronze',
      sessionId: 'gabriel@lightstreams.io',
      pwDerivedKey: null,
      addresses: []
    };

    this.web3 = lw.Web3.create();
    this.createAccount = this.createAccount.bind(this);
    this.sendFunds = this.sendFunds.bind(this);
    this.generateSeed = this.generateSeed.bind(this);
    this.deployContract = this.deployContract.bind(this);
  }

  createAccount(password) {
    lw.Keystore.createPrivateKeys(this.state.sessionId, this.state.seedPhrase, password)
      .then(() => {
        return this.setState({ addresses: lw.Keystore.getAccounts(this.state.sessionId) });
      })
      .then(() => {
        return lw.Keystore.pwDerivedKey(this.state.sessionId, password)
          .then(pwDerivedKey => {
            this.setState({ pwDerivedKey });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  sendFunds(from, to, value) {
    const ks = lw.Keystore.getKsVault(this.state.sessionId);
    const valueInWei = this.web3.utils.toWei(value);
    lw.Signing.signSendValueTx(this.web3, ks, this.state.pwDerivedKey, { from, to, value: valueInWei })
      .then(rawSignedTx => {
        return lw.Web3.sendRawTransaction(this.web3, rawSignedTx);
      })
      .then(txHash => {
        console.log('Tx: ', txHash);
        return lw.Web3.getTxReceipt(this.web3, txHash);
      })
      .then(receipt => {
        console.log('Receipt: ', receipt);
      })
  }

  deployContract(from) {
    const bytecode = "0x608060405234801561001057600080fd5b50610139806100206000396000f3fe60806040526004361061003b576000357c010000000000000000000000000000000000000000000000000000000090048063ef5fb05b14610040575b600080fd5b34801561004c57600080fd5b506100556100d0565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561009557808201518184015260208101905061007a565b50505050905090810190601f1680156100c25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60606040805190810160405280600581526020017f68656c6c6f00000000000000000000000000000000000000000000000000000081525090509056fea165627a7a72305820a4588400fe4d8d1f491fddc52baf334ff52bf76e94c54b376b0b4a3b4f0531ea0029";
    const abi = [
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "sayHello",
        "outputs": [
          {
            "name": "message",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      }
    ];

    const ks = lw.Keystore.getKsVault(this.state.sessionId);
    lw.Signing.signDeployContractTx(this.web3, ks, this.state.pwDerivedKey, { from, bytecode })
      .then(rawSignedTx => {
        return lw.Web3.sendRawTransaction(this.web3, rawSignedTx);
      })
      .then(txHash => {
        console.log('Tx: ', txHash);
        return lw.Web3.getTxReceipt(this.web3, txHash);
      })
      .then(receipt => {
        console.log('Receipt: ', receipt);
        if(receipt.status === true) {
          console.log('Contract deployed at: ', receipt.contractAddress);
        }
      })
  }

  generateSeed() {
    this.setState({seedPhrase: lw.Keystore.generateRandomSeed()})
  }

  render() {
    const { sessionId, addresses, seedPhrase, balances } = this.state;

    return (
      <div>
        <h2>Account Management</h2>
        <label> Seed Phrase:
         <input id='seed' value={seedPhrase} onChange={(e) => this.setState({seedPhrase: e.target.value})}/>
        </label>
        <br/>
        <button onClick={() => this.createAccount('password')}>Create Account</button>
        <button onClick={this.generateSeed}>Generate Seed</button>

        <h3>Accounts</h3>
        <label><b>Session:</b> {sessionId}</label>
        <br />
        <ul>
          {addresses.map((address) => {
            return (
              <li>
                {address + '\t\t'}
                <button onClick={() => this.sendFunds(address, '0xD119b8B038d3A67d34ca1D46e1898881626a082b', '0.1')}>Send Funds</button>
                <button onClick={() => this.deployContract(address)}>Deploy Contract</button>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }
}

export default AccountPage;