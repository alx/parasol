import React, {Component} from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import TextField from 'material-ui/TextField';

@observer
export default class UrlSuffixInput extends Component {

  handleKeyPress = (event) => {

    if (event.key === 'Enter') {

      const appState = this.props.appState;
      let network = Object.assign({}, toJS(appState.selectedNetwork));

      if(appState.ui.componentOptions && appState.ui.componentOptions.UrlSuffixInput) {

        const options = appState.ui.componentOptions.UrlSuffixInput;

        if(options.urlPrefix) {
          network.url = options.urlPrefix;
        }

        if(options.paramsPrefix) {
          network.url += options.paramsPrefix;
        }
      }

      network.url += event.target.value;

      appState.initNetwork(network, () => {
        appState.selectNetwork(appState.networks.length - 1);
        appState.refreshNetwork = Math.random();
      });

    }

  };

  render() {

    const appState = this.props.appState
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph'))
      return null;

    return (
      <TextField
        floatingLabelText={"Add network with suffix"}
        onKeyPress={this.handleKeyPress}
      />
    );
  }
}
