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
      contractAddress: null,
      pwDerivedKey: null,
      web3: null,
      addresses: [],
      ksVault: null
    };


    this.createAccount = this.createAccount.bind(this);
    this.sendFunds = this.sendFunds.bind(this);
    this.generateSeed = this.generateSeed.bind(this);
    this.deployContract = this.deployContract.bind(this);
    this.sendContractTx = this.sendContractTx.bind(this);
  }

  componentDidMount() {
    lw.Web3.initialize('https://node.sirius.lightstreams.io').then(web3 => {
      this.setState({ web3 })
    });
  }

  createAccount(password) {
    lw.Keystore.createKeystoreVault(this.state.seedPhrase, password)
      .then((ksVault) => {
        const addresses = lw.Keystore.addresses(ksVault);
        this.setState({ ksVault, addresses: addresses });
        return ksVault
      })
      .then((ksVault) => {
        return lw.Keystore.pwDerivedKey(ksVault, password)
          .then(pwDerivedKey => {
            this.setState({ pwDerivedKey });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  sendFunds(from, to, value) {
    const { web3, ksVault, pwDerivedKey } = this.state;
    const valueInWei = web3.utils.toWei(value);
    lw.Signing.signSendValueTx(web3, ksVault, pwDerivedKey, { from, to, value: valueInWei })
      .then(rawSignedTx => {
        return lw.Web3.sendRawTransaction(web3, rawSignedTx);
      })
      .then(txHash => {
        console.log('Tx: ', txHash);
        return lw.Web3.getTxReceipt(web3, txHash);
      })
      .then(receipt => {
        console.log('Receipt: ', receipt);
      })
  }

  deployContract(from) {
    const bytecode = '0x6060604052610381806100136000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900480630ff4c9161461006557806329507f731461008c5780637b8d56e3146100a5578063c41a360a146100be578063f207564e146100fb57610063565b005b610076600480359060200150610308565b6040518082815260200191505060405180910390f35b6100a36004803590602001803590602001506101b3565b005b6100bc60048035906020018035906020015061026e565b005b6100cf600480359060200150610336565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61010c60048035906020015061010e565b005b60006000600050600083815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156101af57336000600050600083815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b50565b3373ffffffffffffffffffffffffffffffffffffffff166000600050600084815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561026957806000600050600084815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b5050565b3373ffffffffffffffffffffffffffffffffffffffff166000600050600084815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610303578060006000506000848152602001908152602001600020600050600101600050819055505b5b5050565b600060006000506000838152602001908152602001600020600050600101600050549050610331565b919050565b60006000600050600083815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061037c565b91905056';
    const { web3, ksVault, pwDerivedKey } = this.state;
    lw.Signing.signDeployContractTx(web3, ksVault, pwDerivedKey, { from, bytecode })
      .then(rawSignedTx => {
        return lw.Web3.sendRawTransaction(web3, rawSignedTx);
      })
      .then(txHash => {
        console.log('Tx: ', txHash);
        return lw.Web3.getTxReceipt(web3, txHash);
      })
      .then(receipt => {
        console.log('Receipt: ', receipt);
        if (receipt.status === true) {
          console.log('Contract deployed at: ', receipt.contractAddress);
          this.setState({ contractAddress: receipt.contractAddress })
        }
      })
  }

  sendContractTx(from) {
    const abi = [{
      'constant': true,
      'inputs': [{ 'name': 'key', 'type': 'uint256' }],
      'name': 'getValue',
      'outputs': [{ 'name': 'value', 'type': 'uint256' }],
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{ 'name': 'key', 'type': 'uint256' }, { 'name': 'newOwner', 'type': 'address' }],
      'name': 'transferOwnership',
      'outputs': [],
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{ 'name': 'key', 'type': 'uint256' }, { 'name': 'newValue', 'type': 'uint256' }],
      'name': 'setValue',
      'outputs': [],
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [{ 'name': 'key', 'type': 'uint256' }],
      'name': 'getOwner',
      'outputs': [{ 'name': 'owner', 'type': 'address' }],
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{ 'name': 'key', 'type': 'uint256' }],
      'name': 'register',
      'outputs': [],
      'type': 'function'
    }];

    const { web3, ksVault, pwDerivedKey } = this.state;
    lw.Signing.signContractMethodTx(web3, ksVault, pwDerivedKey,
      { from, abi, address: this.state.contractAddress, method: 'register', params: [123] }
    )
      .then(rawSignedTx => {
        return lw.Web3.sendRawTransaction(web3, rawSignedTx);
      })
      .then(txHash => {
        console.log('Tx: ', txHash);
        return lw.Web3.getTxReceipt(web3, txHash);
      })
      .then(receipt => {
        console.log('Receipt: ', receipt);
      })
  }

  generateSeed() {
    this.setState({ seedPhrase: lw.Keystore.generateRandomSeed() })
  }

  render() {
    const { addresses, seedPhrase, balances } = this.state;

    return (
      <div>
        <h2>Account Management</h2>
        <label> Seed Phrase:
          <input id='seed' value={seedPhrase} onChange={(e) => this.setState({ seedPhrase: e.target.value })}/>
        </label>
        <br/>
        <button onClick={() => this.createAccount('password')}>Create Account</button>
        <button onClick={this.generateSeed}>Generate Seed</button>

        <h3>Accounts</h3>
        <br/>
        <ul>
          {addresses.map((address) => {
            return (
              <li>
                {address + '\t\t'}
                <button
                  onClick={() => this.sendFunds(address, '0xD119b8B038d3A67d34ca1D46e1898881626a082b', '0.1')}>Send
                  Funds
                </button>
                <button onClick={() => this.deployContract(address)}>Deploy Contract</button>
                <button onClick={() => this.sendContractTx(address)}>Contract Tx</button>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }
}

export default AccountPage;