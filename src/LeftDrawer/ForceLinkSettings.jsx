import React from 'react';
import { observer } from 'mobx-react';

import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';

@observer
export default class ForceLinkSettings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};

    this._toggleForceLink = this._toggleForceLink.bind(this);
    this._changeParam = this._changeParam.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.appState.layout);
  }

  _toggleForceLink() {
    if (this.props.appState.layout.running) {
      this.props.appState.stopLayout();
    } else {
      this.props.appState.startLayout();
    }
  }

  _changeParam(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ params: Object.assign(this.state.params, { [name]: value }) });
    this.props.appState.updateLayout(this.state.params);
  }

  _renderParam(key, value) {
    return typeof(value) == 'boolean' ?
      <Toggle
        key={`params-${key}`}
        name={key}
        label={key}
        labelPosition="right"
        toggled={value}
        onToggle={this._changeParam}
      />
    :
      <TextField
        key={`params-${key}`}
        name={key}
        floatingLabelText={key}
        value={value}
        onChange={this._changeParam}
      />;
  }

  render() {

    if (typeof(this.state.running) == 'undefined') return null;

    return (<List>
      <Toggle
        label="ForceLink"
        toggled={this.props.appState.layout.running}
        onToggle={this._toggleForceLink}
      />
      <ListItem key="forcelink-forceatlas2">
        {Object.keys(this.state.params).map(key => this._renderParam(key, this.state.params[key]))}
      </ListItem>
    </List>);

  }

}

ForceLinkSettings.propTypes = {
  appState: require('react').PropTypes.any.isRequired
};
