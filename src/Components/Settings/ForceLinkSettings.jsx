import React from 'react';
import { observer } from 'mobx-react';

import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';

import Spinner from 'react-spinner-material';

@observer
export default class ForceLinkSettings extends React.Component {

  constructor(props) {
    super(props);

    this.state = props.appState.layout;

    this._startForceLink = this._startForceLink.bind(this);
    this._changeParam = this._changeParam.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.appState.layout);
  }

  _startForceLink() {
    this.props.appState.startLayout();
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

    let titleIcon = <AvPlayCircleOutline onClick={this._startForceLink}/>;
    if(this.props.appState.layout.running) {
      const iconStyle = {
        position: 'absolute',
        top: 0,
        right: 4
      };
      titleIcon = (<div style={iconStyle}>
        <Spinner width={24} height={24} spinnerWidth={2} show={true}/>
      </div>);
    }

    return (<List>
      <ListItem key="forcelink-title"
        primaryText='ForceLink'
        rightIcon={titleIcon}>
      </ListItem>
      <ListItem key="forcelink-settings"
        primaryText="Settings"
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        nestedItems={
          Object.keys(this.state.params).map(key => {
            return (<ListItem key={`forcelink-setting-${key}`}
              primaryText={this._renderParam(key, this.state.params[key])}
            />);
          })
        }>
      </ListItem>
    </List>);

  }

}

ForceLinkSettings.propTypes = {
  appState: require('react').PropTypes.any.isRequired
};
