import React, {Component} from 'react';
import { observer } from 'mobx-react';
import {debounce} from 'throttle-debounce';

require('rc-slider/assets/index.css');
require('rc-tooltip/assets/bootstrap.css');

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

@observer
export default class Filters extends Component {

  constructor(props) {
    super(props)
    this.handleNodeFilterSlider = this.handleNodeFilterSlider.bind(this);
    this.handleEdgeFilterSlider = this.handleEdgeFilterSlider.bind(this);
  }

  handleNodeFilterSlider = (range) => {
    this.props.appState.setFilter({
      minNodeSize: range[0],
      maxNodeSize: range[1],
    });
  }

  handleEdgeFilterSlider = (range) => {
    this.props.appState.setFilter({
      minEdgeWeight: range[0],
      maxEdgeWeight: range[1],
    });
  }

  render() {

    const appState = this.props.appState;

    return (<div style={{padding: 10}}>
      <p><span>Node Size</span></p>
      <Range
        defaultValue={[0, appState.graph.maxNodeSize]}
        min={0}
        max={appState.graph.maxNodeSize}
        onAfterChange={this.handleNodeFilterSlider}
      />
      <p><span>Edge Size</span></p>
      <Range
        defaultValue={[0, appState.graph.maxEdgeWeight]}
        min={0}
        max={appState.graph.maxEdgeWeight}
        onAfterChange={this.handleEdgeFilterSlider}
      />
    </div>);

  }


}
