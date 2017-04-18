import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import {List, ListItem, makeSelectable} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconDownload from 'material-ui/svg-icons/file/file-download';


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
    this._selectNetwork = this._selectNetwork.bind(this);
    this._refreshSelectedNetwork = this._refreshSelectedNetwork.bind(this);
    this._downloadSelectedNetwork = this._downloadSelectedNetwork.bind(this);
  }

  _selectNetwork(network_index) {
    this.props.appState.selectNetwork(network_index);
  }

  _refreshSelectedNetwork() {
    this.props.appState.refreshSelectedNetwork();
  }

  _downloadSelectedNetwork() {
    return null;
  }

  render() {

    const appState = this.props.appState;

    const iconStyle = {
      margin: 2,
      position: 'relative',
      width: 20,
      height: 20,
      color: '#999',
    }

    // const selectedNetworkIcons = (<div style={{top: 0}}>
    //   <IconRefresh
    //     style={iconStyle}
    //     onTouchTap={this._refreshSelectedNetwork}/>
    //   <IconDownload
    //     style={iconStyle}
    //     onTouchTap={this._downloadSelectedNetwork}/>
    // </div>);
    const selectedNetworkIcons = null;

    return <SelectableList defaultValue={appState.selectedNetworkIndex}>
      { appState.networks.map( (network, index) => {

        let secondaryText = '';
        if(network.graph) {
          secondaryText = "nodes: " + network.graph.nodes.length
                          + " - " +
                          "edges: " + network.graph.edges.length;
        } else if(network.status && network.status != 'complete') {
          secondaryText = network.status;
        }

        return <ListItem
          key={index}
          value={index}
          primaryText={network.name}
          secondaryText={secondaryText}
          rightIcon={index == appState.selectedNetworkIndex ?
            selectedNetworkIcons
              : (<div/>)}
          onTouchTap={this._selectNetwork.bind(this, index)}
        />
        })
      }
    </SelectableList>

  }

}
