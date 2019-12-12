import React, {Component} from 'react';

import { Web3, Gateway as useGateway, Leth } from 'lightstreams-js-sdk'

class SimpleReactFileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      owner: '',
      account: '',
      grantReadMsg: '',
      gatewayUrl: process.env.GATEWAY_DOMAIN || 'https://gateway.sirius.lightstreams.io'
    };

    this.gateway = useGateway(this.state.gatewayUrl);

    this.onStorageFormSubmit = this.onStorageFormSubmit.bind(this);
    this.onStorageFormFileChange = this.onStorageFormFileChange.bind(this);

    this.onACLFormSubmit = this.onACLFormSubmit.bind(this);

    this.onACLGrantRead = this.onACLGrantRead.bind(this);
    this.onACLGrantWrite = this.onACLGrantWrite.bind(this);
    this.onACLGrantAdmin = this.onACLGrantAdmin.bind(this);
    this.onACLRevokeAccess = this.onACLRevokeAccess.bind(this);
    this.onACLGrantPublicAccess = this.onACLGrantPublicAccess.bind(this);
    this.onACLRevokePublicAccess = this.onACLRevokePublicAccess.bind(this);

    this.onHasRead = this.onHasRead.bind(this);
    this.onHasAdmin = this.onHasAdmin.bind(this);
    this.onGetOwner = this.onGetOwner.bind(this);
  }

  componentDidMount() {
    const web3 = Web3.newEngine(window.process.env.WEB3_PROVIDER);
    const pwd = "notsosecret";

    window.web3 = this.state.web3;

    web3.eth.personal.newAccount(pwd).then((acc) => {
      web3.eth.personal.unlockAccount(acc, pwd).then(() => {
        this.setState({ web3, owner: acc });
      });
    });
  }

  onStorageFormSubmit(e) {
    e.preventDefault();

    const { web3, owner, file } = this.state;

    Leth.Storage.add(web3, this.gateway.storage, {from: owner, owner, file, isPublic: false})
      .then((res) => {
        this.setState({ meta: res.meta, acl: res.acl });
      })
      .catch(console.log)
  }

  onACLFormSubmit(e) {
    e.preventDefault();
  }

  onACLGrantRead() {
    const { web3, owner, account, acl } = this.state;

    Leth.ACL.grantRead(web3, {from: owner, contractAddr: acl, account})
      .then((res) => {
        this.setState({ grantReadMsg: "Read access successfully granted" });
      })
      .catch(console.log)
  }

  onACLGrantWrite() {
    const { web3, owner, account, acl } = this.state;

    Leth.ACL.grantWrite(web3, {from: owner, contractAddr: acl, account})
      .then((res) => {
        this.setState({ grantReadMsg: "Write access successfully granted" });
      })
      .catch(console.log)
  }

  onACLGrantAdmin() {
    const { web3, owner, account, acl } = this.state;

    Leth.ACL.grantAdmin(web3, {from: owner, contractAddr: acl, account})
      .then((res) => {
        this.setState({ grantReadMsg: "Admin access successfully granted" });
      })
      .catch(console.log)
  }

  onACLRevokeAccess() {
    const { web3, owner, account, acl } = this.state;

    Leth.ACL.revokeAccess(web3, {from: owner, contractAddr: acl, account})
      .then((res) => {
        this.setState({ grantReadMsg: "Access successfully revoked" });
      })
      .catch(console.log)
  }

  onACLGrantPublicAccess() {
    const { web3, owner, acl } = this.state;

    Leth.ACL.grantPublicAccess(web3, {from: owner, contractAddr: acl})
      .then((res) => {
        this.setState({ grantReadMsg: "Public access successfully granted" });
      })
      .catch(console.log)
  }

  onACLRevokePublicAccess() {
    const { web3, owner, acl } = this.state;

    Leth.ACL.revokePublicAccess(web3, {from: owner, contractAddr: acl})
      .then((res) => {
        this.setState({ grantReadMsg: "Public access successfully revoked" });
      })
      .catch(console.log)
  }

  onHasRead() {
    const { web3, acl, account } = this.state;

    Leth.ACL.hasRead(web3, {contractAddr: acl, account})
      .then((res) => {
        this.setState({ grantReadMsg: res.toString() });
      })
      .catch(console.log)
  }

  onHasAdmin() {
    const { web3, acl, account } = this.state;

    Leth.ACL.hasAdmin(web3, {contractAddr: acl, account})
      .then((res) => {
        this.setState({ grantReadMsg: res.toString() });
      })
      .catch(console.log)
  }

  onGetOwner() {
    const { web3, acl } = this.state;

    Leth.ACL.getOwner(web3, {contractAddr: acl})
      .then((res) => {
        this.setState({ grantReadMsg: res });
      })
      .catch(console.log)
  }

  onStorageFormFileChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  render() {
    const {owner, account, gatewayUrl, meta, acl, grantReadMsg } = this.state;

    return (
      <div>
        <form onSubmit={this.onStorageFormSubmit}>
          <label>Auto generated account (remember to fund it) </label>
          <input type="text" value={owner} />
          <br />
          <label>Leth Gateway where content is stored in IPFS </label>
          <input type="text" value={gatewayUrl} onChange={(e) => this.setState({ gatewayUrl: e.target.value })} />
          <br />
          <label>File </label>
          <input type="file" onChange={this.onStorageFormFileChange} />
          <br/>
          <button type="submit">Upload with local keys </button>
        </form>

        <h3>Result:</h3>
        <p>Meta: {meta}</p>
        <p>ACL: {acl}</p>
        <p>
          <form onSubmit={this.onACLFormSubmit}>
            <label>Account</label>
            <input type="text" value={account} onChange={(e) => this.setState({ account: e.target.value })} />
            <br />
            <button type="submit" onClick={this.onACLGrantRead}>Grant read</button>
            <button type="submit" onClick={this.onACLGrantWrite}>Grant write</button>
            <button type="submit" onClick={this.onACLGrantAdmin}>Grant admin</button>
            <button type="submit" onClick={this.onACLRevokeAccess}>Revoke read</button>
            <button type="submit" onClick={this.onACLGrantPublicAccess}>Grant public access</button>
            <button type="submit" onClick={this.onACLRevokePublicAccess}>Revoke public access</button>
            <button type="submit" onClick={this.onHasRead}>Has account Read Access?</button>
            <button type="submit" onClick={this.onHasAdmin}>Has account Admin Access?</button>
            <button type="submit" onClick={this.onGetOwner}>Who is the owner?</button>
          </form>
          <p>
            <strong>{grantReadMsg}</strong>
          </p>
        </p>
      </div>
    )
  }
}

export default () => (
  <div>
    <h2>Storage</h2>
    <SimpleReactFileUpload />
  </div>
);
