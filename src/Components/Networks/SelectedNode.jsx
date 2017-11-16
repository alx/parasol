import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
//import Toggle from 'material-ui/Toggle';

import OpenIcon from 'material-ui/svg-icons/action/open-in-new';

import NodeItem from './SelectedNode/NodeItem';

Object.resolve = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || self)
}

@observer
export default class SelectedNode extends Component {

  constructor(props) {
    super(props)
  }

  pinNode = (event, isInputChecked) => {
    this.props.appState.filterGraphNode(isInputChecked);
  }

  linkItem = (node, option) => {
    let linkItem = null;
    let url = null;

    if(option.hrefKey) {
      const href = Object.resolve(option.hrefKey, node);
      url = option.hrefPrefix + href;
    } else if(option.url) {
      url = option.url;
    }

    switch(option.type) {
      case 'image':
        linkItem = <ListItem
          key={option.key ? option.key : 'linkItem'}
        >
          <img
            src={url}
            style={{maxWidth: '100%', minWidth: '100%', width: '100%'}}
          />
        </ListItem>;
        break;
      case 'url':
      default:
        linkItem = <ListItem
          key={option.key ? option.key : 'linkItem'}
          primaryText={option.primaryText ? option.primaryText : url}
          secondaryText={option.secondaryText ? option.secondaryText : 'Open link in new tab'}
          rightIcon={<OpenIcon />}
          onClick={() => {
            const win = window.open(url, '_blank');
            win.focus();
          }}
        />;
    }

    return linkItem;
  }

  render() {

    const appState = this.props.appState;

    if(appState.graph.selectedNodes.length == 0)
      return null;

    const selectedNodes = appState.graph.selectedNodes;
    const node = selectedNodes[selectedNodes.length - 1].node;

    const componentOptions = appState.ui.componentOptions.selectedNode;

    const styles = {
      nestedList: {
         margin: 0,
         fontSize: 14,
         lineHeight: 10,
      },
    }

    //<Toggle
    //   label="Only show this node"
    //    style={styles.toggle}
    //    toggled={appState.graph.isFiltered}
    //    onToggle={this.pinNode}
    //  />

    // Build nested items from node keys
    let nestedItems = [].concat.apply([],
      Object.keys(node).map( (key, index) => {
        return key == 'metadata' ?
          Object.keys(node.metadata)
            .map( (nestedKey, nestedIndex) => <NodeItem
              appState={appState}
              node={node}
              nodeKey={nestedKey}
              isMetadata={true}
            /> )
          :
          <NodeItem
            appState={appState}
            node={node}
            nodeKey={key}
            isMetadata={false}
          />
      })
    )

    const isConfigured = appState.ui.componentOptions &&
      appState.ui.componentOptions.selectedNode;
    const options = isConfigured ? appState.ui.componentOptions.selectedNode : null;

    if(options.link) {
      nestedItems.unshift(this.linkItem(node, options.link));
    }

    if(options.content && options.content.length > 0) {
      options.content.forEach( (c, index) => {
        let content = null;
        c.content.key = `content-${index}`;
        switch(c.type) {
          case 'link':
            content = this.linkItem(node, c.content);
            break;
        }
        nestedItems.push(content);
      });
    }

    return (<div>
      <Subheader>
        Selected Node
      </Subheader>
      <List>
        <ListItem
          key='selectednode'
          primaryText={node.label || node.id}
          leftAvatar={<Avatar backgroundColor={node.color.toString()} />}
          primaryTogglesNestedList={true}
          initiallyOpen={nestedItems.length > 0}
          nestedListStyle={styles.nestedList}
          nestedItems={nestedItems}
        />
      </List>
    </div>);
  }
};
