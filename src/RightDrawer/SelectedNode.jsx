import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class SelectedNode extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const node = this.props.node;

    if(!node)
      return null;

    const styles = {
      nestedList: {
         margin: 0,
         fontSize: 14,
         lineHeight: 10,
      },
      nestedListItem: {
         margin: 0,
         padding: '10 8 8',
      }
    }

    return (
      <List>
        <Subheader>Selected Node</Subheader>
        <ListItem
          primaryText={node.id}
          leftAvatar={<Avatar backgroundColor={node.color} />}
          primaryTogglesNestedList={true}
          initiallyOpen={true}
          nestedListStyle={styles.nestedList}
          nestedItems= { Object.keys(node).filter( key => {

              return key.indexOf('cam0:') == -1;

            }).map( (key, index) => {

              let primaryText = node[key];

              if(typeof(primaryText) == 'boolean') {
                primaryText = primaryText ? 'true' : 'false';
              }

              return <ListItem
                key={index}
                primaryText={primaryText}
                secondaryText={key}
                innerDivStyle={styles.nestedListItem}
              />;
            })
          }
        />
      </List>
    );
  }
};
