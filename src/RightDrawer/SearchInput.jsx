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

    return network.get('graph').nodes.map( node => {

      const category = node.metadata ? node.metadata.category : '';

      let icon = ''
      if(category != '') {
        icon = <Avatar backgroundColor={node.color} size={10} />
      }

      return {
        text: node.label,
        node_id: node.id,
        value: (
          <MenuItem
            style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "pre" }}
            primaryText={node.label}
            secondaryText={icon}
          />
        )
      };

    });

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

  render() {

    const appState = this.props.appState
    const network = appState.selectedNetwork;

    if(!network.has('graph'))
      return null;

    const datasource = this.setupDatasource(network);

    return (
      <div>
        <AutoComplete
          hintText="Search"
          searchText={this.state.searchText}
          dataSource={datasource}
          filter={AutoComplete.caseInsensitiveFilter}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
        />
      </div>
    );
  }
}
