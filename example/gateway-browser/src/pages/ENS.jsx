/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Lightwallet as lw, Web3, ENS } from 'lightstreams-js-sdk';

export default class ENSPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seed: 'guess tonight return rude vast goat shadow grant comfort december uniform bronze',
      password: 'WelcomeToSirius',
      account: '',
      tld: 'lsn',
      pwDerivedKey: null,
      ksVault: null
    };
  }

  componentDidMount() {
    Web3.initialize('http://localhost:8545').then(web3 => {
      this.setState({ web3 })
    });
  }

  createAccount = () => {
    const { seed, password } = this.state;
    lw.Keystore.createKeystoreVault(seed, password)
      .then((ksVault) => {
        const addresses = lw.Keystore.addresses(ksVault);
        this.setState({ ksVault, account: addresses[0] });
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
  };

  registryDomain = () => {
    const { web3, ksVault, pwDerivedKey, account, tld } = this.state;
    ENS.FIFSRegistrar.deployLightWallet(web3, ksVault, pwDerivedKey, { from: account, tld })
      .then((txReceipt) => {
        console.log(txReceipt);
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { seed, password, account, tld } = this.state;
    return (
      <div>
        <h2>ENS Test</h2>
        <h3>Step 1: Create account</h3>
        <label>Seed:
          <input value={seed} style={{ width: '500px' }} onChange={(e) => this.setState({ seed: e.target.value })}/>
        </label>
        <br/>
        <label>Password:
          <input type='password' style={{ width: '300px' }} value={password}
                 onChange={(e) => this.setState({ password: e.target.value })}/>
        </label>
        <br/>
        <button onClick={() => this.createAccount()}>Create Account</button>
        <h3>Step 2: Register ENS</h3>
        <label>Owner:
          <input value={account} disabled style={{ width: '300px' }}/>
        </label>
        <br/>
        <label>TLD:
          <input type='input' style={{ width: '150px' }} value={tld}
                 onChange={(e) => this.setState({ tld: e.target.value })}/>
        </label>
        <br/>
        <button onClick={() => this.registryDomain()}>Registry domain</button>
      </div>
    )
  }
}
