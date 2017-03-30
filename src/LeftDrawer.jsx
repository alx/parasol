import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import {debounce} from 'throttle-debounce';

import Legend from './LeftDrawer/Legend';

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
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';

import ActionAllOut from 'material-ui/svg-icons/action/all-out';
import ActionAspectRatio from 'material-ui/svg-icons/action/aspect-ratio';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import {spacing, typography} from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
  logo: {
    backgroundColor: cyan500,
  },
  logoTitle: {
    fontSize: 24,
    color: typography.textFullWhite,
    fontWeight: typography.fontWeightLight,
    marginLeft: 50,
  },
  drawerToggle: {
    position: 'absolute',
    top: 10,
    width: 40,
    height: 40,
    padding: 5,
    marginTop: 4,
    background: cyan500,
  },
  drawerToggleIcon: {
    width: 48,
    height: 48,
    color: typography.textFullWhite,
  }
}

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
export default class LeftDrawer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nodeSize: props.appState.ui.filters.nodeSize,
      edgeSize: props.appState.ui.filters.nodeSize,
    };
    this.createNetwork = this.createNetwork.bind(this);
    this.selectNetwork = this.selectNetwork.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.callFilter = debounce(500, this.callFilter);
    this.handleNodeFilterSlider = this.handleNodeFilterSlider.bind(this);
    this.handleEdgeFilterSlider = this.handleEdgeFilterSlider.bind(this);
  }

  createNetwork(e) {
    if (e.keyCode==13){
      this.props.appState.createNetwork({url: e.target.value});
      e.target.value = "";
    }
  }

  selectNetwork(network_index) {
    this.props.appState.selectNetwork(network_index);
  }

  toggleDrawer() {
    this.props.appState.toggleLeftDrawer();
  }

  callFilter = (filter, value) => {
    this.props.appState.setFilter(filter, value);
  }

  handleNodeFilterSlider = (event, value) => {
    this.setState({nodeSize: value});
    this.callFilter('nodeSize', value);
  }

  handleEdgeFilterSlider = (event, value) => {
    this.setState({edgeSize: value});
    this.callFilter('edgeSize', value);
  }


  componentWillReceiveProps(props) {
    this.setState({
      nodeSize: props.appState.ui.filters.nodeSize,
      edgeSize: props.appState.ui.filters.nodeSize,
    });
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
    //    <ListItem key={3} primaryText="Restore Scale" rightIcon={<ActionAspectRatio />}/>,
    //    <ListItem key={4} primaryText="Run Force Atlas" rightIcon={<ActionAllOut />}/>
    //  ]}
    ///>
    //<Divider/>

    return (
      <div>
        <IconButton
          onTouchTap={this.toggleDrawer}
          style={styles.drawerToggle}
        >
          <ChevronRight style={styles.drawerToggleIcon}/>
        </IconButton>
        <Drawer open={this.props.appState.ui.leftDrawer}>
          <AppBar
            style={styles.logo}
            titleStyle={styles.logoTitle}
            title="Parasol"
            iconElementLeft={<IconButton
              onTouchTap={this.toggleDrawer}
              style={styles.drawerToggle}
            >
              <ChevronLeft
                color={typography.textFullWhite}
                style={styles.drawerToggleIcon}
              />
            </IconButton>}
          />
          <TextField
            hintText="JSON url"
            floatingLabelText="Add network"
            floatingLabelFixed={true}
            onKeyDown={this.createNetwork}
          />
          <SelectableList defaultValue={appState.selectedNetworkIndex}>
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

          <Divider/>

          <Legend network={appState.selectedNetwork} colors={appState.ui.colors.nodes} />
        </Drawer>
      </div>
    );
  }
};
