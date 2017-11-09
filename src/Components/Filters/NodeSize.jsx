import React, {Component} from 'react';
import { observer } from 'mobx-react';

import {Line} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';

require('rc-slider/assets/index.css');
require('rc-tooltip/assets/bootstrap.css');

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

@observer
export default class NodeSize extends Component {

  constructor(props) {
    super(props)
    this.state = {
      key: 0,
      resolution: 100,
      step: 1,
      min: 0,
      max: 100,
      ratio: 100,
    }
    this._handleSlider = this._handleSlider.bind(this);
  }

  _handleSlider = (range) => {
    this.props.appState.setFilter({
      minNodeSize: range[0] / this.state.ratio,
      maxNodeSize: range[1] / this.state.ratio,
    });
  }

  componentWillReceiveProps(nextProps) {
    const appState = nextProps.appState;
    this.setState({
      key: Math.random(),
      min: appState.ui.filters.minNodeSize,
      max: appState.ui.filters.maxNodeSize
    });
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    if(!network || !network.has('source_graph'))
      return null;

    const graph = network.get('source_graph');

    if(graph.nodes.length == 0 ||
      graph.nodes.filter(n => n.size && n.size > 0).length == 0)
      return null;

    const chartOptions = {
      tooltips: {
        enabled: false
      },
      showScale: false,
      showXAxisLabel:false,
      scales: {
        xAxes: [{
          display: false,
          ticks: { display: false },
          gridLines: { display: false },
          barPercentage: 1,
          categoryPercentage : 1
        }],
        yAxes: [{
          display: false,
          ticks: { display: false},
          gridLines: { display: false },
        }]
      },
      legend: {display: false },
      showLines: true,
      steppedLine: 'before',
      elements: {
        line: {
          tension: 0, // disables bezier curves
        }
      },
      animation: {
        duration: 0, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0
    };

    const chartData = {
      labels: new Array(this.state.resolution),
      datasets: [
        {data: new Array(this.state.resolution), backgroundColor: '#00BCD4', borderWidth: 0}
      ]
    };

    for(let i = 0; i < this.state.resolution; i++) {

      //if(i / this.state.resolution < appState.ui.filters.minEdgeWeight ||
      //  (i + 1) / this.state.resolution > appState.ui.filters.maxEdgeWeight) {
      //  chartData.datasets[1].data[i] = graph.edges.filter(e => {
      //    return e.weight >= (i / this.state.resolution) &&
      //      e.weight < ((i + 1) / this.state.resolution)
      //  }).length;
      //} else {
      chartData.datasets[0].data[i] = graph.nodes.filter(n => {
        return n.size >= (i / this.state.resolution) &&
          n.size < ((i + 1) / this.state.resolution)
      }).length;

    }

    return (<div key={'filterNodeSize'} style={{padding: 10}}>
      <p><span>Node Size</span></p>
      <Bar
        data={chartData}
        height={'50px'}
        options={chartOptions}
      />
      <Range
        key={'nodeSize'}
        defaultValue={[this.state.min, this.state.max]}
        min={0}
        max={100}
        step={this.state.step}
        onAfterChange={this._handleSlider}
        tipFormatter={value => value/this.state.ratio}
      />
    </div>);

  }

}
