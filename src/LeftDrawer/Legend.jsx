import React from 'react';
import { observer } from 'mobx-react';

import Avatar from 'material-ui/Avatar';
import {List, ListItem } from 'material-ui/List';

@observer
export default class Legend extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const network = this.props.appState.selectedNetwork;

    if(!network || !network.has('graph') || !network.has('colors'))
      return null

    const colors = network.get('colors');

    const graph = network.get('graph');
    const nodes = graph.nodes;

    const legendItems = nodes.map( node => {
        return node.metadata ? node.metadata.category : null;
      }).filter(n => {
        return n != undefined;
      }).filter( (category, index, self) => {
        return self.indexOf(category) === index;
      }).filter( category => {
        return typeof(category) != 'undefined' && category.length > 0;
      }).map( (category, index) => {

        const count = nodes.filter(node => node.metadata && node.metadata.category == category).length;

        return <ListItem
            key={index}
            disabled={true}
            leftAvatar={<Avatar size={30} backgroundColor={colors.nodes[index]}/>}
          >{category} ({count})</ListItem>;
      });

    if(legendItems.length == 0)
      return null;

    return (<List>
      <ListItem
        primaryText="Legend"
        primaryTogglesNestedList={true}
        initiallyOpen={true}
        nestedItems={legendItems}
      />
    </List>);

  }
}
