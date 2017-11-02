import React, { Component } from 'react';
import { observer } from 'mobx-react';

import SigmaComponent from '../Components/SigmaComponent';
import Drawer from '../Components/Drawer';

@observer
export default class ParasolFullscreen extends Component {

  render() {
    const appState = this.props.appState;
    return <div>
      <SigmaComponent appState={appState}/>
      {appState.ui.drawers.map( (drawer, index) => {
        return <Drawer key={'drawer' + index} drawer={drawer} appState={appState}/>;
      })}
    </div>;
  }
}
