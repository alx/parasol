import React from 'react';

import TextField from 'material-ui/TextField';

export default class NetworkInput extends React.Component {

  constructor(props) {
    super(props)
    this.createNetwork = this.createNetwork.bind(this);
  }

  createNetwork(e) {
    if (e.keyCode==13){
      this.props.appState.createNetwork({url: e.target.value});
      e.target.value = "";
    }
  }

  render() {

    return <TextField
      hintText="JSON url"
      floatingLabelText="Add network"
      floatingLabelFixed={true}
      onKeyDown={this.createNetwork}
    />

  }

}
