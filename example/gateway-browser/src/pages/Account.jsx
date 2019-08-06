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
      password: 'password',
      addresses: []
    };

    this.web3 = lw.Web3.create();
    this.createAccount = this.createAccount.bind(this);
    this.sendFunds = this.sendFunds.bind(this);
    this.generateSeed = this.generateSeed.bind(this);
  }

  createAccount() {
    lw.Keystore.createPrivateKeys(this.state.sessionId, this.state.seedPhrase, this.state.password)
      .then(() => {
        return this.setState({ addresses: lw.Keystore.getAccounts(this.state.sessionId) });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  sendFunds(from, to, value) {
    const ks = lw.Keystore.getKsVault(this.state.sessionId);
    const valueInWei = this.web3.utils.toWei(value);
    lw.Signing.signSendValueTx(this.web3, ks, { from, to, password: this.state.password, value: valueInWei })
      .then(rawSignedTx => {
        console.log(lw.Web3);
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
        <button onClick={this.createAccount}>Create Account</button>
        <button onClick={this.generateSeed}>Generate Seed</button>

        <h3>Accounts</h3>
        <label><b>Session:</b> {sessionId}</label>
        <br />
        <ul>
          {addresses.map((address) => {
            return (
              <li>
                {address + '\t\t'}
                <button onClick={() => this.sendFunds(address, '0xD119b8B038d3A67d34ca1D46e1898881626a082b', '0.1')}>Send Funds</button></li>
            );
          })}
        </ul>
      </div>
    )
  }
}

export default AccountPage;