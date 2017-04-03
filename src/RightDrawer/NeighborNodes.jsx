import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

@observer
export default class NeighborNodes extends Component {

  constructor(props) {
    super(props)
    this.selectNode = this.selectNode.bind(this);
  }

  selectNode(node_id) {
    this.props.appState.selectGraphNode(node_id);
  }

  render() {

    const nodes = this.props.appState.graph.neighborNodes;

    if(!nodes || nodes.length == 0)
      return null;

    return (
      <List>
        <Subheader>Neighbor Nodes</Subheader>
        {
          nodes.map( node => {
            return <ListItem
              primaryText={node.id}
              leftAvatar={<Avatar backgroundColor={node.color} />}
              rightIcon={<ArrowForward />}
              onTouchTap={this.selectNode.bind(this, node.id)}
            />
          })
        }
      </List>
    );
  }
};
