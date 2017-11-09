import React from 'react';
import { observer } from 'mobx-react';

import {List, ListItem } from 'material-ui/List';

import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

@observer
export default class TopicSelector extends React.Component {

  constructor(props) {
    super(props)

    this._toggleTopic = this._toggleTopic.bind(this);
  }

  _toggleTopic = (topicIndex) => {
    const appState = this.props.appState;
    appState.toggleTopicFilter(topicIndex);
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph') || !network.has('topics'))
      return null

    const topics = network.get('topics');
    const graph = network.get('graph');
    const nodes = graph.nodes;

    const topicItems = topics.map( (topic, index) => {

      // return node count of nodes
      // with the max value theta corresponding to this topic
      const count = nodes.filter( node => {
        if(
          node.hidden ||
          !node.metadata ||
          !node.metadata.theta ||
          node.metadata.theta.length == 0
          ) {
          return false;
        } else {
          const theta = node.metadata.theta
          const indexOfMaxTheta = theta.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
          return index == indexOfMaxTheta;
        }
      }).length;

        const styles = {
          toggle: {
            fontSize: 30,
            height: 40,
            width: 40,
            cursor: 'pointer',
          }
        };

        let topicToggle = (<RadioButtonChecked
          style={styles.toggle}
          color={topic.color}
          onClick={this._toggleTopic.bind(this, index)}
        />);

        if(appState.ui.filters.topics.includes(index)) {
          topicToggle = (<RadioButtonUnchecked
            style={styles.toggle}
            color={topic.color}
            onClick={this._toggleTopic.bind(this, index)}
          />);
        }

        return <ListItem
            key={index}
            disabled={true}
            leftAvatar={topicToggle}
            primaryText={`Topic ${index + 1} (${count})`}
            secondaryText={topic.terms.map(term => term.term).join(', ')}
          />;
      });

    if(topicItems.length == 0)
      return null;

    return (<List>
      <ListItem
        primaryText={this.props.primaryText || "Topics"}
        primaryTogglesNestedList={true}
        initiallyOpen={true}
        nestedItems={topicItems}
      />
    </List>);

  }
}
