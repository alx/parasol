import React, {Component} from 'react';
import { observer } from 'mobx-react';
import {debounce} from 'throttle-debounce';

import Toggle from 'material-ui/Toggle';

var BarChart = require("react-chartjs").Bar;

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
      minNodeSize: range[0] / 100,
      maxNodeSize: range[1] / 100,
    });
  }

  handleEdgeFilterSlider = (range) => {
    this.setState({edge: {min: range[0], max: range[1]}});
    this.props.appState.setFilter({
      minEdgeWeight: range[0] / 100,
      maxEdgeWeight: range[1] / 100,
    });
  }

  handleHideOrphans = (event, toggle) => {
    this.props.appState.setFilter({hideOrphans: toggle});
  }

  componentWillReceiveProps(nextProps) {
    const appState = nextProps.appState;
    this.setState({
      key: Math.random(),
      node: {min: appState.ui.filters.minNodeSize, max: appState.ui.filters.maxNodeSize},
      edge: {min: appState.ui.filters.minEdgeWeight, max: appState.ui.filters.maxEdgeWeight}
    });
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    if(!network || !network.has('graph'))
      return null;

    const graph = network.get('graph');
      /**
      <p><span>Node Size</span></p>
      <Range
        key={'nodeSize-' + appState.graph.maxNodeSize}
        defaultValue={[0, appState.graph.maxNodeSize]}
        min={0}
        max={appState.graph.maxNodeSize}
        onAfterChange={this.handleNodeFilterSlider}
      />
      */
    var chartOptions = {
      responsive: true,
      showTooltip: false,
      showScale: false,
    };
    var chartData = {
      labels: new Array(10),
      datasets: [
        {
          data: [
            graph.edges.filter(e => e.weight < 0.1).length,
            graph.edges.filter(e => e.weight >= 0.1 && e.weight < 0.2).length,
            graph.edges.filter(e => e.weight >= 0.2 && e.weight < 0.3).length,
            graph.edges.filter(e => e.weight >= 0.3 && e.weight < 0.4).length,
            graph.edges.filter(e => e.weight >= 0.4 && e.weight < 0.5).length,
            graph.edges.filter(e => e.weight >= 0.5 && e.weight < 0.6).length,
            graph.edges.filter(e => e.weight >= 0.6 && e.weight < 0.7).length,
            graph.edges.filter(e => e.weight >= 0.7 && e.weight < 0.8).length,
            graph.edges.filter(e => e.weight >= 0.8 && e.weight < 0.9).length,
            graph.edges.filter(e => e.weight >= 0.9).length
          ]
        }
      ]
    };

    return (<div key={'filterSliders'} style={{padding: 10}}>
      <p><span>Edge Weight</span></p>
      <BarChart data={chartData} options={chartOptions}/>
      <Range
        key={'edgeWeight'}
        defaultValue={[0, 100]}
        min={0}
        max={100}
        step={10}
        onAfterChange={this.handleEdgeFilterSlider}
        tipFormatter={value => value/100}
      />
      <Toggle
        label="Hide orphan nodes"
        toggled={appState.ui.filters.hideOrphans}
        onToggle={this.handleHideOrphans}
      />
    </div>);

  }


}
