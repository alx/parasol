import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import NodeItem from './SelectedNode/NodeItem';
import LinkItem from './SelectedNode/LinkItem';
import TopicChart from './SelectedNode/TopicChart';

@observer
export default class SelectedNode extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const appState = this.props.appState;

    if(appState.graph.selectedNodes.length == 0)
      return null;

    const selectedNodes = appState.graph.selectedNodes;
    const node = selectedNodes[selectedNodes.length - 1].node;

    let componentOptions = null;
    if(appState.ui.componentOptions &&
      appState.ui.componentOptions.selectedNode) {
      componentOptions = appState.ui.componentOptions.selectedNode;

      if(componentOptions.disable)
        return null;
    }

    const styles = {
      nestedList: {
         margin: 0,
         fontSize: 14,
         lineHeight: 10,
      },
    }

    let nestedItems = [];

    if(componentOptions) {

      if(componentOptions.content && componentOptions.content.length > 0) {
        nestedItems = componentOptions.content.map( (content, index) => {
          const isMetadata = content.field && content.field.includes('metadata.');
          let nodeKey = '';
          if(content.field) {
              nodeKey = isMetadata ? content.field.replace('metadata.', '') : content.field;
          }
          switch(content.type) {
            case 'topicChart':
              return <TopicChart
                key={`topicChart-${index}`}
                title={content.title ? content.title : content.field.replace('metadata.', '')}
                topics={appState.selectedNetwork.get('topics')}
                data={isMetadata ? node.metadata[nodeKey] : node[nodeKey]}
              />
            case 'link':
              content.key = `content-${index}`
              return <LinkItem
                node={node}
                option={content}
              />
              break;
            default:
              return <NodeItem
                appState={appState}
                node={node}
                nodeKey={nodeKey}
                isMetadata={isMetadata}
              />
          }
        });
      }
    } else {
      nestedItems = [].concat.apply([],
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
