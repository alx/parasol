import React from 'react';
import { observer } from 'mobx-react';

import ForceLinkSettings from './Layouts/ForceLinkSettings';

@observer
export default class Layout extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const appState = this.props.appState;
    const selectedNetwork = appState.selectedNetwork;

    if(!selectedNetwork)
      return null;

    let layoutController = null;

    switch(selectedNetwork.get('options').layout) {
      case 'none':
        break;
      case 'forcelink':
      case 'forceatlas':
      case 'forceatlas2':
        layoutController = (<ForceLinkSettings appState={appState} />);
        break;
      default:
        layoutController = (<ForceLinkSettings appState={appState} />);
    }

    return layoutController;

  }

}
