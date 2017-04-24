import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import ToggleIcon from './LeftDrawer/ToggleIcon';
import ParasolAppBar from './LeftDrawer/ParasolAppBar';
import NetworkInput from './LeftDrawer/NetworkInput';
import NetworkList from './LeftDrawer/NetworkList';
import FilterSettings from './LeftDrawer/FilterSettings';
import Layout from './LeftDrawer/Layout';
import Legend from './LeftDrawer/Legend';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

@observer
export default class LeftDrawer extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const appState = this.props.appState;

    return (
      <div>

        <ToggleIcon appState={appState} />

        <Drawer open={appState.ui.leftDrawer}>

          <ParasolAppBar appState={appState} />

          <NetworkInput appState={appState} />
          <NetworkList appState={appState} />

          <Divider/>

          <Layout appState={appState} />

          <Divider/>

          <Legend appState={appState} />

        </Drawer>
      </div>
    );
  }
};
