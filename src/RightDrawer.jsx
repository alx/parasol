import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import SelectedNode from './RightDrawer/SelectedNode';
import NeighborNodes from './RightDrawer/NeighborNodes';

@observer
export default class RightDrawer extends Component {

  constructor(props) {
    super(props)
    this.selectNode = this.selectNode.bind(this);
  }

  selectNode(node_id) {
    this.props.appState.selectGraphNode(node_id);
  }

  render() {

    const appState = this.props.appState;

    return (
      <Drawer openSecondary={true} open={appState.ui.rightDrawer} >
        <SelectedNode node={appState.graph.selectedNode} />
        <Divider/>
        <NeighborNodes
          nodes={appState.graph.neighborNodes}
          onSelect={this.selectNode}
        />
      </Drawer>
    );
  }
};
