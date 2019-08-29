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
      domain: 'fanbase.lsn',
      ensAddress: '',
      resolverAddress: '',
      pwDerivedKey: null,
      ksVault: null
    };
  }

  componentDidMount() {
    Web3.initialize('http://localhost:8545').then(web3 => {
      this.setState({ web3 });
      window.web3 = this.state.web3;
    });
  }

  createAccount = async () => {
    const { seed, password } = this.state;
    try {
      console.log(`Creating keystorevault...`);
      const ksVault = await lw.Keystore.createKeystoreVault(seed, password);
      const pwDerivedKey = await lw.Keystore.pwDerivedKey(ksVault, password);
      // const addresses = lw.Keystore.addresses(ksVault);
      // const address = addresses[0];
      const web3Provider = lw.Web3Provider.HookedWeb3Provider(ksVault, pwDerivedKey, {
        host: web3.eth.currentProvider.host
      });
      this.state.web3.setProvider(web3Provider);
      const accounts = await this.state.web3.eth.getAccounts();
      // await Web3.unlockAccount(this.state.web3, address, password);
      this.setState({ ksVault, account: accounts[0] });
    } catch(err) {
      console.error(err);
    }
  };

  registryTld = async (tld) => {
    const { web3, account} = this.state;
    try {
      const { ensAddress, resolverAddress }= await ENS.SDK.deployNewRegistry(web3, { from: account });
      await ENS.SDK.registerNode(web3, { ensAddress, from: account, node: tld});
      this.setState({ ensAddress, resolverAddress });
    } catch(err) {
      console.error(err);
    }
  };

  registryDomain = async (domain) => {
    const { web3, account, ensAddress, resolverAddress } = this.state;
    try {
      const ens = ENS.SDK.initializeManager(web3.currentProvider, ensAddress);
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
