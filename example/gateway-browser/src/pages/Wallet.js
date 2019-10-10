/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Web3, EthersWallet as EW, ENS, Web3Provider } from 'lightstreams-js-sdk';

export default class WalletPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seed: 'guess tonight return rude vast goat shadow grant comfort december uniform bronze',
      password: 'WelcomeToSirius',
      encryptedJson: '',
      wallet: '',
      tld: 'lsn',
      address: null,
      web3: null,
      ensAddress: '',
      resolverAddress: ''
    };
  }

  componentDidMount() {
    Web3.newEngine(window.process.env.WEB3_PROVIDER).then(web3 => {
      this.setState({ web3 });
      window.web3 = this.state.web3;
      window.ethers = require('ethers');
    });
  }

  randomizeSeedPhrase = () => {
    const seed = EW.Keystore.generateRandomSeedPhrase();
    this.setState({ seed });
  };

  createAccount = async () => {
    const { web3 } = this.state;
    const encryptedJson = await EW.Keystore.createWallet(this.state.seed, this.state.password);
    const address= EW.Account.formatAddress(encryptedJson.address);
    web3.currentProvider.importAccount(encryptedJson);
    await web3.eth.personal.unlockAccount(address, this.state.password);
    this.setState({ encryptedJson, address: address });
  };

  registryTld = async (tld) => {
    const { web3, address } = this.state;
    try {
      const { ensAddress, resolverAddress } = await ENS.SDK.deployNewRegistry(web3, { from: address });
      await ENS.SDK.registerNode(web3, { ensAddress, from: address, subnode: tld });
      this.setState({ ensAddress, resolverAddress });
    } catch ( err ) {
      console.error(err);
    }
  };

  render() {
    const { seed, password, tld } = this.state;
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
        <label>Address:
          <input disabled value={this.state.address} style={{ width: '500px' }} />
        </label>
        <br />
        <br/>
        <textarea disabled value={JSON.stringify(this.state.encryptedJson)} rows="12" cols="50"/>
        <h3>Step 3: Deploy ENS</h3>
        <label>TLD:
          <input type='input' style={{ width: '150px' }} value={this.state.tld}
                 onChange={(e) => this.setState({ tld: e.target.value })}/>
        </label>
        <br/>
        <label>ENS Registry contract:
          <input value={this.state.ensAddress} disabled style={{ width: '300px' }}/>
        </label>
        <br/>
        <label>Resolver contract:
          <input value={this.state.resolverAddress} disabled style={{ width: '300px' }}/>
        </label>
        <br/>
        <button onClick={() => this.registryTld(this.state.tld)}>Registry TLD</button>
      </div>
    )
  }
}
