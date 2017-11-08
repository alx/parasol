import React, {Component} from 'react';
import { observer } from 'mobx-react';

import Toggle from 'material-ui/Toggle';

@observer
export default class HideOrphan extends Component {

  constructor(props) {
    super(props)
    this.handleHideOrphans = this.handleHideOrphans.bind(this);
  }

  handleHideOrphans = (event, toggle) => {
    this.props.appState.setFilter({hideOrphans: toggle});
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    if(!network || !network.has('graph'))
      return null;

    return (<div key={'filterHideOrphan'} style={{padding: 10}}>
      <Toggle
        label="Hide orphan nodes"
        toggled={appState.ui.filters.hideOrphans}
        onToggle={this.handleHideOrphans}
      />
    </div>);

  }

}
