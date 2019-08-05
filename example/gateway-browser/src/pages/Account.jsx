import React, { Component } from 'react';

export default class SimpleReactFileUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      owner: '',
      password: ''
    };
  }

  createAccount() {
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