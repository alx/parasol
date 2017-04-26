import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';

@observer
export default class SelectedNode extends Component {

  constructor(props) {
    super(props)
  }

  pinNode = (event, isInputChecked) => {
    this.props.appState.filterGraphNode(isInputChecked);
  }

  render() {

    const appState = this.props.appState;
    const node = appState.graph.selectedNode;

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
      },
      nestedNestedListItem: {
         margin: 0,
         padding: '10 8 16',
      }
    }

    return (<div>
      <Subheader>
        Selected Node
      </Subheader>
      <Toggle
        label="Only show this node"
        style={styles.toggle}
        toggled={appState.graph.isFiltered}
        onToggle={this.pinNode}
      />
      <List>
        <ListItem
          key='selectednode'
          primaryText={node.label || node.id}
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

              if(key == 'metadata') {

                const metadataItems = Object.keys(node.metadata).map( (nestedKey, nestedIndex) => {
                    let nestedText = node.metadata[nestedKey];

                    if(typeof(nestedText) == 'boolean') {
                      nestedText = nestedText ? 'true' : 'false';
                    }

                    return <ListItem
                      key={`metadata-${nestedIndex}`}
                      primaryText={nestedText}
                      secondaryText={'metadata - ' + nestedKey}
                      innerDivStyle={styles.nestedListItem}
                    />;
                });

                return <List key='nested-metadata'>{metadataItems}</List>;

              } else {
                return <ListItem
                  key={'selectednode-' + index}
                  primaryText={primaryText}
                  secondaryText={key}
                  innerDivStyle={styles.nestedListItem}
                />;
              }
            })
          }
        />
      </List>
    </div>);
  }
};
