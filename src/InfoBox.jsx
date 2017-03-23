import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

@observer
export default class SigmaComponent extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const appState = this.props.appState;
    const selectedNode = appState.graph.selectedNode;

    const styles = {
      selectedNodeNestedList: {
         margin: 0,
         fontSize: 14,
         lineHeight: 10,
      },
      selectedNodeNestedListItem: {
         margin: 0,
         padding: '10 8 8',
      }
    }

    if(!selectedNode)
      return null;

    return (
      <Drawer openSecondary={true} open={appState.ui.rightDrawer} >
        <List>
          <Subheader>Selected Node</Subheader>
          <ListItem
            primaryText={selectedNode.id}
            leftAvatar={<Avatar backgroundColor={selectedNode.color} />}
            primaryTogglesNestedList={true}
            initiallyOpen={true}
            nestedListStyle={styles.selectedNodeNestedList}
            nestedItems= { Object.keys(selectedNode).filter( key => {

                return key.indexOf('cam0:') == -1;

              }).map( (key, index) => {

                let primaryText = selectedNode[key];

                if(typeof(primaryText) == 'boolean') {
                  primaryText = primaryText ? 'true' : 'false';
                }

                return <ListItem
                  key={index}
                  primaryText={primaryText}
                  secondaryText={key}
                  innerDivStyle={styles.selectedNodeNestedListItem}
                />;
              })
            }
          />
        </List>
      </Drawer>
    );
  }
};
