import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import {List, ListItem } from 'material-ui/List';

import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

@observer
export default class Legend extends React.Component {

  constructor(props) {
    super(props)

    this._filterCategory = this._filterCategory.bind(this);
    this._unfilterCategory = this._unfilterCategory.bind(this);
  }

  _filterCategory = (category) => {
    const appState = this.props.appState;
    let filteredCategories = toJS(appState.ui.filters.categories);
    if(!filteredCategories.includes(category)) {
      filteredCategories.push(category);
    }
    appState.setFilter({categories: filteredCategories});
  }

  _unfilterCategory = (category) => {
    const appState = this.props.appState;
    let filteredCategories = toJS(appState.ui.filters.categories);
    if(filteredCategories.includes(category)) {
      filteredCategories.splice(filteredCategories.indexOf(category), 1);
    }
    appState.setFilter({categories: filteredCategories});
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph') || !network.has('categories'))
      return null


    const categories = network.get('categories');
    const graph = network.get('graph');
    const nodes = graph.nodes;

    const legendItems = categories.map( (category, index) => {

        const count = nodes.filter(node => node.metadata && node.metadata.category == category.name).length;

        const styles = {
          toggle: {
            fontSize: 30,
            height: 40,
            width: 40,
            cursor: 'pointer',
          }
        };

        let categoryToggle = (<RadioButtonChecked
          style={styles.toggle}
          color={category.color}
          onClick={this._filterCategory.bind(this, category.name)}
        />);

        if(appState.ui.filters.categories.includes(category.name)) {
          console.log('use unchecked');
          categoryToggle = (<RadioButtonUnchecked
            style={styles.toggle}
            color={category.color}
            onClick={this._unfilterCategory.bind(this, category.name)}
          />);
        }

        return <ListItem
            key={index}
            disabled={true}
            leftAvatar={categoryToggle}
          >{category.name} ({count})</ListItem>;
      });

    if(legendItems.length == 0)
      return null;

    return (<List>
      <ListItem
        primaryText={this.props.primaryText || "Legend"}
        primaryTogglesNestedList={true}
        initiallyOpen={true}
        nestedItems={legendItems}
      />
    </List>);

  }
}
