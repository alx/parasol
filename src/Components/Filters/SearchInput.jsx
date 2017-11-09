import React, {Component} from 'react';
import { observer } from 'mobx-react';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';

@observer
export default class SearchInput extends Component {

  state = {
    searchText: '',
  };

  setupDatasource = (network) => {

    let datasource = network.get('graph').nodes.map( node => {

      const category = node.metadata ? node.metadata.category : '';

      let icon = ''
      if(category != '' || node.color) {
        icon = <Avatar
          backgroundColor={node.color.toString()}
          size={25}
          style={{marginTop: 12}}
        />;
      }

      let result_text = node.id;
      if(node.metadata && node.metadata.label) {
        result_text = node.metadata.label;
      }

      return {
        text: result_text,
        node_id: node.id,
        value: (
          <MenuItem
            style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "pre" }}
            primaryText={result_text}
            secondaryText={icon}
          />
        )
      };

    });

    /*
    datasource.push({
      text: 'filter_action',
      action: 'display_filtered',
      value: (
        <MenuItem
          primaryText={<RaisedButton label="Show only these nodes" fullWidth={true} />}
        />
      )
    });
    */

    return datasource;

  }

  handleUpdateInput = (value) => {
    this.setState({
      searchText: value,
    });
  };

  handleNewRequest = (value) => {
    this.setState({
      searchText: '',
    });
    this.props.appState.selectGraphNode(value.node_id);
  };

  filter = (searchText, key) => {
    return searchText.length > 1 &&
      (key == 'filter_action' ||
      key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  };

  render() {

    const appState = this.props.appState
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph'))
      return null;

    const datasource = this.setupDatasource(network);

    return (
      <div>
        <AutoComplete
          hintText={this.props.hintText ? this.props.hintText : "Search"}
          searchText={this.state.searchText}
          dataSource={datasource}
          filter={this.filter}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
        />
      </div>
    );
  }
}
