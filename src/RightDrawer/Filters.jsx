import React, {Component} from 'react';
import { observer } from 'mobx-react';
import {debounce} from 'throttle-debounce';

import Toggle from 'material-ui/Toggle';

require('rc-slider/assets/index.css');
require('rc-tooltip/assets/bootstrap.css');

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

@observer
export default class Filters extends Component {

  constructor(props) {
    super(props)
    this.state = {
      key: 0,
      node: {min: 0, max: 1},
      edge: {min: 0, max: 1}
    }
    this.handleNodeFilterSlider = this.handleNodeFilterSlider.bind(this);
    this.handleEdgeFilterSlider = this.handleEdgeFilterSlider.bind(this);
    this.handleHideOrphans = this.handleHideOrphans.bind(this);
  }

  handleNodeFilterSlider = (range) => {
    this.setState({node: {min: range[0], max: range[1]}});
    this.props.appState.setFilter({
      minNodeSize: range[0],
      maxNodeSize: range[1],
    });
  }

  handleEdgeFilterSlider = (range) => {
    this.setState({edge: {min: range[0], max: range[1]}});
    this.props.appState.setFilter({
      minEdgeWeight: range[0],
      maxEdgeWeight: range[1],
    });
  }

  handleHideOrphans = (event, toggle) => {
    this.props.appState.setFilter({hideOrphans: toggle});
  }

  componentWillReceiveProps(nextProps) {
    console.log('receive filter props');
    const appState = nextProps.appState;
    this.setState({
      key: Math.random(),
      node: {min: appState.ui.filters.minNodeSize, max: appState.ui.filters.maxNodeSize},
      edge: {min: appState.ui.filters.minEdgeWeight, max: appState.ui.filters.maxEdgeWeight}
    });
  }

  render() {

    const appState = this.props.appState;

    return (<div key={this.state.key} style={{padding: 10}}>
      <p><span>Node Size</span></p>
      <Range
        defaultValue={[this.state.node.min,this.state.node.max]}
        min={0}
        max={appState.graph.maxNodeSize}
        onAfterChange={this.handleNodeFilterSlider}
      />
      <p><span>Edge Weight</span></p>
      <Range
        defaultValue={[this.state.edge.min,this.state.edge.max]}
        min={0}
        max={appState.graph.maxEdgeWeight}
        onAfterChange={this.handleEdgeFilterSlider}
      />
      <Toggle
        label="Hide orphan nodes"
        toggled={appState.ui.filters.hideOrphans}
        onToggle={this.handleHideOrphans}
      />
    </div>);

  }


}
