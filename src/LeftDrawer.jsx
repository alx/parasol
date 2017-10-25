import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import ToggleIcon from './Components/ToggleIcon';
import AppBar from './Components/AppBar';

import NetworkInput from './Components/Networks/Input';
import NetworkList from './Components/Networks/List';

import Layout from './Components/Settings/ForceLinkSettings';

import Legend from './Components/Filters/Legend';

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

          <AppBar appState={appState} />

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
