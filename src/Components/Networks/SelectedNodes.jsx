import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { List, ListItem } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import IconAdd from 'material-ui/svg-icons/content/add';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconDeleteSweep from 'material-ui/svg-icons/content/delete-sweep';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconSave from 'material-ui/svg-icons/content/save';

import NeighborNodes from './NeighborNodes';
import axios from 'axios';

@observer
export default class SelectedNodes extends Component {

  constructor(props) {
    super(props);
    this._removeNode = this._removeNode.bind(this);
    this._removeSubnetwork = this._removeSubnetwork.bind(this);
    this._removeSelection = this._removeSelection.bind(this);
    this._reorganizeSelection = this._reorganizeSelection.bind(this);
    this._createMeta = this._createMeta.bind(this);
    this._saveSelection = this._saveSelection.bind(this);
  }

  _removeNode = (node_id) => {
    this.props.appState.removeNodeFromGraph(node_id);

    return true;
  }

  _removeSubnetwork = (node_id) => {
    let token = document.getElementsByName('csrf-token')[0].getAttribute('content');
    axios.defaults.headers.common['X-CSRF-Token'] = token;
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.delete('/toolings/'+node_id).then(response => {
    console.log ("subnetwork deleted")
    });
    this.props.appState.removeSubnetworkFromGraph(node_id);
    return true;
  }

  _removeSelection = (node_id) => {
    this.props.appState.removeNodeFromSelection(node_id);
    return true;
  }

  _reorganizeSelection = () => {
    this.props.appState.reorganizeSelection();
    return true;
  }

  _createMeta = () => {
    this.props.appState.createMeta();
    return true;
  }

  _saveSelection = () => {
    this.props.appState.saveSelection();
    return true;
  }

  nodeItem(selection, index) {

    const node = selection.node;
    const neighborNodes = selection.neighborNodes;

    const styles = {
      container: {
        top: 0,
        width: 'auto',
      },
      icon: {
        margin: 2,
        position: 'relative',
        width: 20,
        height: 20,
        color: '#999',
      }
    }

    const selectedNodeIcons = (<div style={styles.container}>
      <IconClear
        style={styles.icon}
        onTouchTap={this._removeSelection.bind(this, node.id)}/>
      <IconDelete
        style={styles.icon}
        onTouchTap={this._removeNode.bind(this, node.id)}/>
      <IconDeleteSweep
        style={styles.icon}
        onTouchTap={this._removeSubnetwork.bind(this, node.id)}/>
    </div>);

    return (<ListItem
      key={index}
      primaryText={node.label || node.id}
      secondaryText={node.author}
      rightIcon={selectedNodeIcons}
      primaryTogglesNestedList={true}
      initiallyOpen={false}
      nestedItems={[<NeighborNodes nodes={neighborNodes}/>]}
    />);
  }

  render() {

    const appState = this.props.appState;

    if(appState.graph.selectedNodes.length == 0)
      return null;

    const selectedNodes = appState.graph.selectedNodes;

    let buttons = [];
    if(selectedNodes.length >= 2) {
      buttons.push(<FloatingActionButton
        mini={true}
        onTouchTap={this._createMeta}
        style={{marginRight: 10}}
      >
        <IconAdd />
      </FloatingActionButton>);
    }

    if(selectedNodes.length >= 1) {
      buttons.push(<FloatingActionButton
        mini={true}
        secondary={true}
        onTouchTap={this._reorganizeSelection}
        style={{marginRight: 10}}
      >
        <IconRefresh />
      </FloatingActionButton>);

      buttons.push(<FloatingActionButton
        mini={true}
        secondary={true}
        onTouchTap={this._reorganizeSelection}
        style={{marginRight: 10}}
      >
        <IconSave />
      </FloatingActionButton>);
    }

    return (<List>
      <ListItem disabled={true}>{buttons}</ListItem>
      {
        selectedNodes.map((selection, index) => {
          return this.nodeItem(selection, index)
        })
      }
    </List>);
  }
};
