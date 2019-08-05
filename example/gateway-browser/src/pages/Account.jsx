/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react';

import { Web3 } from 'lightstreams-js-sdk';

class AccountPage extends Component {

  constructor(props) {
    super(props);
    console.log(Web3);
    this.web3 = Web3(process.env.WEB3_PROVIDER);
    this.createAccount = this.createAccount.bind(this);
  }

  createAccount() {
    this.web3.wallet.createPrivateKey();
    console.log('Create Account');
  }

  render() {
    return (
      <div>
        <h2>Account Management</h2>
        <button onClick={this.createAccount}>Create Account</button>
        <br/>
      </div>
    )
  }
}

export default AccountPage;