import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';

export default class ForceLinkSettings extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      forcelink: {}
    };

    this.startForceLink = this.startForceLink.bind(this);
    this.stopForceLink = this.stopForceLink.bind(this);
    this.updateForceLink = this.updateForceLink.bind(this);
  }

  startForceLink = () => {
    this.props.appState.startForceLink();
  }

  stopForceLink = () => {
    this.props.appState.stopForceLink();
  }

  updateForceLink = () => {
    this.props.appState.updateForceLink(this.state.forcelink);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({forcelink: nextProps.appState.layout.forcelink});
  }

  render() {

    return <List>
      <Subheader>ForceLink</Subheader>
      <ListItem key='forcelink-controls'>
        <RaisedButton
          label="Start"
          primary={true}
          disabled={this.state.forcelink.running}
          onTouchTap={this.startForceLink}
        />
        <RaisedButton
          label="Stop"
          secondary={true}
          disabled={!this.state.forcelink.running}
          onTouchTap={this.stopForceLink}
        />
      </ListItem>
      <ListItem key='forcelink-forceatlas2'>
        <Toggle
          label="linLogMode"
          labelPosition="right"
          onTouchTap={this.updateForceLink}
        /><br />
        <Toggle
          label="outboundAttractionDistribution"
          labelPosition="right"
          onTouchTap={this.updateForceLink}
        /><br />
        <Toggle
          label="adjustSizes"
          labelPosition="right"
          onTouchTap={this.updateForceLink}
        /><br />
        <TextField
          defaultValue="0"
          floatingLabelText="edgeWeightInfluence"
          onChange={this.updateForceLink}
        /><br />
        <TextField
          defaultValue="1"
          floatingLabelText="scalingRatio"
          onChange={this.updateForceLink}
        /><br />
        <Toggle
          label="strongGravityMode"
          labelPosition="right"
          onTouchTap={this.updateForceLink}
        /><br />
        <TextField
          defaultValue="1"
          floatingLabelText="gravity"
          onChange={this.updateForceLink}
        /><br />
        <Toggle
          label="barnesHutOptimize"
          labelPosition="right"
          onTouchTap={this.updateForceLink}
        /><br />
        <TextField
          defaultValue="0.5"
          floatingLabelText="barnesHutTheta"
          onChange={this.updateForceLink}
        /><br />
        <TextField
          defaultValue="1"
          floatingLabelText="slowDown"
          onChange={this.updateForceLink}
        /><br />
        <TextField
          defaultValue="locally"
          floatingLabelText="randomize"
          onChange={this.updateForceLink}
        /><br />
      </ListItem>
    </List>


  }

}
