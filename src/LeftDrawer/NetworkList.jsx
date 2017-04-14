import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import {List, ListItem, makeSelectable} from 'material-ui/List';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

@observer
export default class NetworkList extends React.Component {

  constructor(props) {
    super(props)
    this.selectNetwork = this.selectNetwork.bind(this);
  }

  selectNetwork(network_index) {
    this.props.appState.selectNetwork(network_index);
  }

  render() {

    const appState = this.props.appState;

    return <SelectableList defaultValue={appState.selectedNetworkIndex}>
      { appState.networks.map( (network, network_index) => {

        let secondaryText = '';
        if(network.graph) {
          secondaryText = "nodes: " + network.graph.nodes.length
                          + " - " +
                          "edges: " + network.graph.edges.length;
        }

        return <ListItem
          key={network_index}
          value={network_index}
          primaryText={network.name}
          secondaryText={secondaryText}
          onTouchTap={this.selectNetwork.bind(this, network_index)}
        />
        })
      }
    </SelectableList>

  }

}
