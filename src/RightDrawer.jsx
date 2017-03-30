import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Drawer from 'material-ui/Drawer';

import SelectedNode from './RightDrawer/SelectedNode';

@observer
export default class RightDrawer extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const appState = this.props.appState;

    return (
      <Drawer openSecondary={true} open={appState.ui.rightDrawer} >
        <SelectedNode node={appState.graph.selectedNode} />
      </Drawer>
    );
  }
};
