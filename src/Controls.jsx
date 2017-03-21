import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';

import ActionAllOut from 'material-ui/svg-icons/action/all-out';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ImageTransform from 'material-ui/svg-icons/image/transform';

import {
  teal500,
  amber500,
} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
export default class Controls extends Component {

  constructor(props) {
    super(props)
    this.createNetwork = this.createNetwork.bind(this);
    this.selectNetwork = this.selectNetwork.bind(this);
  }

  createNetwork(e) {
    if (e.keyCode==13){
      this.props.appState.createNetwork(e.target.value);
    }
  }

  selectNetwork(network_index) {
    this.props.appState.selectNetwork(network_index);
  }

  render() {

    const appState = this.props.appState;

    //<ListItem
    //  primaryText="Settings"
    //  primaryTogglesNestedList={true}
    //  initiallyOpen={true}
    //  nestedItems={[
    //    <ListItem key={1} primaryText="Labels" rightToggle={<Toggle />} />,
    //    <ListItem key={2} primaryText="Clusters" rightToggle={<Toggle />} />,
    //    <ListItem key={3} primaryText="Restore Scale" rightIcon={<ImageTransform />}/>,
    //    <ListItem key={4} primaryText="Run Force Atlas" rightIcon={<ActionAllOut />}/>
    //  ]}
    ///>
    //<Divider/>

    return (
      <Drawer>
        <AppBar title="Parasol" showMenuIconButton={false} />
        <TextField
          hintText="JSON url"
          floatingLabelText="Add network"
          floatingLabelFixed={true}
          onKeyDown={this.createNetwork}
        />
        <SelectableList defaultValue={appState.networkIndex}>
          <Subheader inset={true}>Available Networks</Subheader>
          { appState.networkUrls.map( (network, network_index) => {
            return <ListItem
              key={network_index}
              value={network_index}
              primaryText={network.name}
              secondaryText={moment(network.timestamp).format("DD/MM/YYYY [at] HH:mm")}
              onTouchTap={this.selectNetwork.bind(this, network_index)}
            />
            })
          }
        </SelectableList>
        <Divider/>
        <List>
          <ListItem
            primaryText="Legend"
            primaryTogglesNestedList={true}
            initiallyOpen={true}
            nestedItems={[
              <ListItem
                key={1}
                disabled={true}
                leftAvatar={
                  <Avatar
                    size={30}
                    backgroundColor={amber500}
                  >
                    V
                  </Avatar>
                  }
                >
                  Vendors
              </ListItem>,
              <ListItem
                key={2}
                disabled={true}
                leftAvatar={
                  <Avatar
                    size={30}
                    backgroundColor={teal500}
                  >
                    C
                  </Avatar>
                  }
                >
                  Clients
              </ListItem>
            ]}
          />
        </List>
      </Drawer>
    );
  }
};
