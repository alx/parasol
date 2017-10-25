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

    if(appState.graph.selectedNodes.length == 0)
      return null;

    const selectedNodes = appState.graph.selectedNodes;
    const node = selectedNodes[selectedNodes.length - 1].node;

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
          leftAvatar={<Avatar backgroundColor={node.color.toString()} />}
          primaryTogglesNestedList={true}
          initiallyOpen={true}
          nestedListStyle={styles.nestedList}
          nestedItems= { [].concat.apply([], Object.keys(node).filter( key => {

              return key.indexOf('cam0:') == -1;

            }).map( (key, index) => {

              if(!node[key])
                return null;

              let primaryText = node[key].toString();

              if(typeof(primaryText) == 'boolean') {
                primaryText = primaryText ? 'true' : 'false';
              }

              if(key == 'metadata') {

                return Object.keys(node.metadata)
                  .filter(nestedKey => nestedKey != 'transactions')
                  .map( (nestedKey, nestedIndex) => {
                    primaryText = node.metadata[nestedKey].toString();

                    if(typeof(primaryText) == 'boolean') {
                      primaryText = primaryText ? 'true' : 'false';
                    }

                    return <ListItem
                      key={'selectednode-metadata-' + nestedIndex}
                      primaryText={primaryText}
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
          )}
        />
      </List>
    </div>);
  }
};
