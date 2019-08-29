/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Web3, EthersWallet as EW } from 'lightstreams-js-sdk';

export default class WalletPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seed: 'guess tonight return rude vast goat shadow grant comfort december uniform bronze',
      password: 'WelcomeToSirius',
      encryptedJson: '',
      wallet: '',
      address: null,
    };
  }

  componentDidMount() {
    Web3.initialize(window.process.env.WEB3_PROVIDER).then(web3 => {
      this.setState({ web3 });
      window.web3 = this.state.web3;
    });
  }

  randomizeSeedPhrase = () => {
    const seed = EW.Keystore.generateRandomSeedPhrase();
    this.setState({ seed });
  };

  createAccount = async () => {
    const encryptedJson = await EW.Keystore.createRandomWallet(this.state.password);
    const wallet = await EW.Keystore.decryptWallet(encryptedJson, this.state.password);
    this.setState({ encryptedJson, address: encryptedJson.address, wallet });
  };

  render() {
    const { seed, password } = this.state;
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
        <button onClick={() => this.randomizeSeedPhrase()}>Randomize Seed Phrase</button>
        <button onClick={() => this.createAccount()}>Create Account</button>
        <h3>Step 2: Unlock account</h3>
        <label>Seed:
          <input disabled value={this.state.address} style={{ width: '500px' }} />
        </label>
        <br />
        <textarea disabled value={JSON.stringify(this.state.encryptedJson)} rows="20" cols="50"/>
      </div>
    )
  }
}
