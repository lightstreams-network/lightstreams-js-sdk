/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Web3, EthersWallet as EW, ENS, Web3Provider, Leth } from 'lightstreams-js-sdk';

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
      peerId: "",
      web3: null,
      ensAddress: '',
      resolverAddress: '',
      authToken: '',
      error: ''
    };
  }

  componentDidMount() {
    const web3 = Web3.newEngine(window.process.env.WEB3_PROVIDER);
    this.setState({ web3 });
    window.web3 = this.state.web3;
  }

  randomizeSeedPhrase = () => {
    const seed = EW.Keystore.generateRandomSeedPhrase();
    this.setState({ seed });
  };

  createAccount = async () => {
    const { web3 } = this.state;
    const decryptedWallet = await EW.Keystore.createWallet(this.state.seed);
    const encryptedJson = await EW.Keystore.encryptWallet(decryptedWallet, this.state.password);
    const address = EW.Account.formatAddress(encryptedJson.address);
    web3.currentProvider.importAccount(encryptedJson, decryptedWallet);
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

  generateAuthToken = async () => {
    const { web3, address, peerId } = this.state;

    try {
      const token = await Leth.Token.generateAuthToken(web3, { address, tokenBlocksLifespan: 10000, peerId });

      this.setState({ authToken: token });
    } catch (err) {
      console.log(err)
      this.displayError(err);
    }
  };

  displayError = (error) => {
    this.setState({ error: error });
  };

  render() {
    const { seed, password, tld } = this.state;
    return (
      <div>
        <h2 style={{color: "red"}}>{this.state.error}</h2>

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

        <br/>
        <h3>Step 3: Generate Leth auth token</h3>
        <label>PeerID:
          <input type='input' style={{ width: '350px' }} value={this.state.peerId}
        onChange={(e) => this.setState({ peerId: e.target.value })}/>
        </label>
        <textarea value={this.state.authToken} rows="12" cols="50"/>
        <br/>
        <button onClick={() => this.generateAuthToken()}>Generate</button>

        <br/>
      </div>
    )
  }
}
