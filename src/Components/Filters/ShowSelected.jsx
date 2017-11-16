import React, {Component} from 'react';
import { observer } from 'mobx-react';

import Toggle from 'material-ui/Toggle';

@observer
export default class ShowSelected extends Component {

  constructor(props) {
    super(props)
    this._handleShowSelected = this._handleShowSelected.bind(this);
  }

  _handleShowSelected = (event, toggle) => {
    this.props.appState.setFilter({onlyShowSelected: toggle});
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph'))
      return null;

    const selectedNodes = network.get('graph').selectedNodes;

    if(!selectedNodes || selectedNodes.length == 0)
      return null;

    return (<div key={`filterShowSelected`} style={{padding: 10}}>
      <Toggle
        label="Only show selected nodes"
        toggled={appState.ui.filters.onlyShowSelected}
        onToggle={this._handleShowSelected}
      />
    </div>);

  }

}
