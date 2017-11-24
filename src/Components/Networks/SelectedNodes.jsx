import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { List, ListItem } from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import IconAdd from 'material-ui/svg-icons/content/add';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconDeleteSweep from 'material-ui/svg-icons/content/delete-sweep';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconSave from 'material-ui/svg-icons/content/save';
import IconOpen from 'material-ui/svg-icons/action/open-in-new';

import NeighborNodes from './NeighborNodes';
import axios from 'axios';

Object.resolve = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || self)
}

@observer
export default class SelectedNodes extends Component {

  constructor(props) {
    super(props);
    this._removeNode = this._removeNode.bind(this);
    this._removeSelection = this._removeSelection.bind(this);
    this._saveSelection = this._saveSelection.bind(this);
  }

  _removeNode = (node_id) => {
    this.props.appState.removeNodeFromGraph(node_id);

    return true;
  }

  _removeSelection = (node_id) => {
    this.props.appState.removeNodeFromSelection(node_id);
    return true;
  }

  _saveSelection = () => {
    this.props.appState.saveSelection();
    return true;
  }

  nodeItem(selection, index, options = {}) {

    const node = selection.node;

    let nestedItems = [];
    if(options.showNeighbor) {
      nestedItems.push(<NeighborNodes nodes={selection.neighborNodes}/>);
    }

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

    let icons = [
      <IconClear
        key={`removeSelection`}
        style={styles.icon}
        onClick={this._removeSelection.bind(this, node.id)}/>,
          /**
      <IconDelete
        style={styles.icon}
        onClick={this._removeNode.bind(this, node.id)}/>
      */
    ]

    if(options.iconUrl) {
      const href = Object.resolve(options.iconUrl.hrefKey, node);
      const url = options.iconUrl.hrefPrefix + href;
      icons.unshift(<IconOpen
        key={`openItem`}
        style={styles.icon}
        onClick={() => {
          const win = window.open(url, '_blank');
          win.focus();
        }}/>);
    }

    const selectedNodeIcons = (<div style={styles.container}>
      {icons}
    </div>);

    let primaryText = node.label || node.id;
    if(options.itemPrimary) {
      switch(options.itemPrimary.type) {
        case 'text':
          primaryText = options.itemPrimary.value;
          break;
        case 'attr':
          primaryText = Object.resolve(options.itemPrimary.key, node);
          break;
      }
      if(options.itemPrimary.prependText)
        primaryText = options.itemPrimary.prependText + primaryText;
      if(options.itemPrimary.appendText)
        primaryText += options.itemPrimary.appendText;
    }

    let secondaryText = node.size;
    if(options.itemSecondary) {
      switch(options.itemSecondary.type) {
        case 'text':
          secondaryText = options.itemSecondary.value;
          break;
        case 'attr':
          secondaryText = Object.resolve(options.itemSecondary.key, node);
          break;
      }
      if(options.itemSecondary.prependText)
        secondaryText = options.itemSecondary.prependText + primaryText;
      if(options.itemSecondary.appendText)
        secondaryText += options.itemSecondary.appendText;
    }


    return (<ListItem
      key={index}
      primaryText={primaryText}
      secondaryText={secondaryText}
      rightIcon={selectedNodeIcons}
      primaryTogglesNestedList={true}
      initiallyOpen={false}
      nestedItems={nestedItems}
    />);
  }

  render() {

    const appState = this.props.appState;

    if(appState.graph.selectedNodes.length == 0)
      return null;

    let componentOptions = null;
    if(appState.ui.componentOptions &&
      appState.ui.componentOptions.selectedNodes) {
      componentOptions = appState.ui.componentOptions.selectedNodes;

      if(componentOptions.disable)
        return null;
    }

    const selectedNodes = appState.graph.selectedNodes;

    let buttons = [];
    if(selectedNodes.length >= 2) {
      buttons.push(<RaisedButton
        key={`createNetwork`}
        label="Network"
        secondary={true}
        onClick={this._saveSelection}
        style={{marginRight: 10}}
        icon={<IconAdd />}
      />);
    }

    return (<List>
      <ListItem disabled={true}>{buttons}</ListItem>
      {
        selectedNodes.map((selection, index) => {
          return this.nodeItem(selection, index, componentOptions)
        })
      }
    </List>);
  }
};
