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
  }

  render() {
    
    const nodes = this.props.nodes;

    if(!nodes || nodes.length == 0)
      return null;

    return (
      <List>
        {
          nodes.map( (node, index) => {
            return <ListItem
              key={'NeighborNodes-' + index}
              primaryText={node.label || node.id}
              leftAvatar={<Avatar
                key={'NeighborNodesAvatar-' + index}
                backgroundColor={node.color}
              />}
            />
          })
        }
      </List>
    );
  }
};
