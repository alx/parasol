import React from 'react';

import Avatar from 'material-ui/Avatar';
import {List, ListItem } from 'material-ui/List';

import {
  teal500,
  amber500,
  cyan500,
} from 'material-ui/styles/colors';

const COLORS = [teal500, amber500, cyan500];

export default class Legend extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const network = this.props.network;

    if(!network || !network.graph)
      return null

    const legendItems = network.graph.nodes.map( node => {
        return node.category;
      }).filter( (category, index, self) => {
        return self.indexOf(category) === index;
      }).filter( category => {
        return typeof(category) != 'undefined' && category.length > 0;
      }).map( (category, index) => {
        return <ListItem
            key={index}
            disabled={true}
            leftAvatar={<Avatar size={30} backgroundColor={COLORS[index]}/>}
          >{category}</ListItem>;
      });

    if(legendItems.length == 0)
      return null;

    return <List>
      <ListItem
        primaryText="Legend"
        primaryTogglesNestedList={true}
        initiallyOpen={true}
        nestedItems={legendItems}
      />
    </List>

  }
}
