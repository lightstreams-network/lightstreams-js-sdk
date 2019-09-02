/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Web3, ENS, EthersWallet as EW, Web3Provider } from 'lightstreams-js-sdk';

export default class ENSPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      seed: 'guess tonight return rude vast goat shadow grant comfort december uniform bronze',
      password: 'WelcomeToSirius',
      account: '',
      tld: 'lsn',
      domain: 'fanbase',
      ensAddress: '',
      resolverAddress: '',
      ens: null
    };
  }

  componentDidMount() {
    const provider = Web3Provider({ rpcUrl: window.process.env.WEB3_PROVIDER });
    Web3.initialize(provider).then(web3 => {
      this.setState({ web3 });
      window.web3 = this.state.web3;
      window.ethers = require('ethers');
    });
  }

  createAccount = async () => {
    const { seed, password, web3 } = this.state;
    try {
      const encryptedJson = await EW.Keystore.createWallet(seed, password);
      web3.currentProvider.importAccount(encryptedJson);
      this.setState({ account: EW.Account.formatAddress(encryptedJson.address) });
    } catch(err) {
      console.error(err);
    }
  };

  registryTld = async (tld) => {
    const { web3, account} = this.state;
    try {
      if (web3.currentProvider.isAccountLocked(account)) {
        await Web3.unlockAccount(web3, {address: account, password: this.state.password});
      }

      const { ensAddress, resolverAddress } = await ENS.SDK.deployNewRegistry(web3, { from: account });
      await ENS.SDK.registerNode(web3, { ensAddress, from: account, node: tld});
      const ens = ENS.SDK.initializeManager(web3.currentProvider, ensAddress);
      this.setState({ ensAddress, resolverAddress, ens });
    } catch(err) {
      console.error(err);
    }
  };

  registryDomain = async (domain) => {
    const { web3, account, resolverAddress, ens } = this.state;
    try {
      if (web3.currentProvider.getAccount(account).isLocked()) {
        await web3.currentProvider.getAccount(account).unlock(this.state.password);
      }

      console.log(`Registering ${domain}...`);
      await ens.setSubnodeOwner(domain, account, { from: account });
      console.log(`Setting resolver ...`);
      await ens.setResolver(domain, resolverAddress, { from: account });
      console.log(`Setting address ...`);
      await ens.resolver(domain).setAddr(account, { from: account });
      let address = await ens.resolver(domain).addr();
      console.log(`${domain} is pointing to ${address}`);
    } catch ( err ) {
      console.error(err);
    }
  };

  render() {
    const { seed, password, account, tld, ensAddress, domain, resolverAddress } = this.state;
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
        <h3>Step 2: Deploy ENS</h3>
        <label>Owner:
          <input value={account} disabled style={{ width: '300px' }}/>
        </label>
        <br/>
        <label>TLD:
          <input type='input' style={{ width: '150px' }} value={tld}
                 onChange={(e) => this.setState({ tld: e.target.value })}/>
        </label>
        <br/>
        <button onClick={() => this.registryTld(tld)}>Registry TLD</button>
        <h3>Step 3: Registry new subdomain</h3>
        <label>ENS Registry contract:
          <input value={ensAddress} disabled style={{ width: '300px' }}/>
        </label>
        <br/>
        <label>Resolver contract:
          <input value={resolverAddress} disabled style={{ width: '300px' }}/>
        </label>
        <br/>
        <label>Domain:
          <input type='input' style={{ width: '150px' }} value={domain}
                 onChange={(e) => this.setState({ tld: e.target.value })}/>
        </label>
        <br/>
        <button onClick={() => this.registryDomain(domain)}>Registry Domain</button>
        <br/>
        <br/>
      </div>
    )
  }
}
