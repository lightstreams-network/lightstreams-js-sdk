import React, {Component} from 'react';

import { Web3, Gateway as useGateway, Leth } from 'lightstreams-js-sdk'

class SimpleReactFileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = { file: null, owner: '', gatewayUrl: process.env.GATEWAY_DOMAIN || 'https://gateway.sirius.lightstreams.io' };
    this.gateway = useGateway(this.state.gatewayUrl);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this)
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

  onFormSubmit(e) {
    e.preventDefault();

    const { web3, owner, file } = this.state;

    Leth.Storage.add(web3, this.gateway.storage, {from: owner, owner, file, isPublic: false})
      .then((res) => {
        this.setState({ meta: res.meta, acl: res.acl });
      })
      .catch(console.log)
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  render() {
    const {owner, gatewayUrl, meta, acl } = this.state;

    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <label>Auto generated account (remember to fund it) </label>
          <input type="text" value={owner} />
          <br />
          <label>Leth Gateway where content is stored in IPFS </label>
          <input type="text" value={gatewayUrl} onChange={(e) => this.setState({ gatewayUrl: e.target.value })} />
          <br />
          <label>File </label>
          <input type="file" onChange={this.onChange} />
          <br/>
          <button type="submit">Upload with local keys </button>
        </form>

        <h3>Result:</h3>
        <p>Meta: {meta}</p>
        <p>ACL: {acl}</p>
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
