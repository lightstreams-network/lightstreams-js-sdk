/**
 * User: ggarrido
 * Date: 17/05/19 14:33
 * Copyright 2019 (c) Lightstreams, Granada
 */

import React, { Component } from 'react'
import { Gateway as useGateway } from 'lightstreams-js-sdk'

class SimpleReactFileUpload extends Component {

  constructor(props) {
    super(props);
    this.state = { file: null, owner: '', password: '' };
    this.gateway = useGateway(process.env.GATEWAY_DOMAIN || 'https://gateway.sirius.lightstreams.io');
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this)
  }

  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    const { owner, password, file } = this.state;
    this.gateway.storage.add(owner, password, file)
      .then(console.log)
      .catch(console.error)
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }


  render() {
    const {owner, password } = this.state;
    return (
      <form onSubmit={this.onFormSubmit}>
        <label>Owner</label>
        <input type="text" value={owner} onChange={(e) => this.setState({owner: e.target.value})}/>
         <br />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => this.setState({ password: e.target.value })} />
         <br/>
        <label>File</label>
        <input type="file" onChange={this.onChange} />
        <br/>
        <button type="submit">Upload</button>
      </form>
    )
  }
}

export default SimpleReactFileUpload