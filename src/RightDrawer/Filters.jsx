import React, {Component} from 'react';
import { observer } from 'mobx-react';
import {debounce} from 'throttle-debounce';

import Slider from 'material-ui/Slider';

@observer
export default class Filters extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nodeSize: props.appState.ui.filters.nodeSize,
      edgeSize: props.appState.ui.filters.edgeSize,
    };
    this.callFilter = debounce(500, this.callFilter);
    this.handleNodeFilterSlider = this.handleNodeFilterSlider.bind(this);
    this.handleEdgeFilterSlider = this.handleEdgeFilterSlider.bind(this);
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
      edgeSize: props.appState.ui.filters.edgeSize,
    });
  }

  render() {

    const appState = this.props.appState;

    return (<div>
      <p><span>Node Size: {this.state.nodeSize}</span></p>
      <Slider
        step={1}
        value={this.state.nodeSize}
        max={appState.ui.filters.maxNodeSize}
      />
      <p><span>Edge Size: {this.state.edgeSize}</span></p>
      <Slider
        step={1}
        value={this.state.edgeSize}
        max={appState.ui.filters.maxEdgeSize}
      />
    </div>);

  }


}
