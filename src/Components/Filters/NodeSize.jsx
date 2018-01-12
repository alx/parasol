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
      step: 100,
      min: null,
      max: null,
    }
    this._handleSlider = this._handleSlider.bind(this);
  }

  _handleSlider = (range) => {
    this.setState({min: range[0], max: range[1]});
    this.props.appState.setFilter({
      minNodeSize: range[0],
      maxNodeSize: range[1],
    });
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    if(!network || !network.has('source_graph'))
      return null;

    const graph = network.get('source_graph');
    console.log(network.get('graph').refresh);

    if(graph.nodes.length == 0 ||
       graph.nodes.filter(n => n.size && n.size > 0).length == 0 ||
       graph.minNodeSize == Infinity ||
       graph.maxNodeSize == -Infinity ||
       graph.minNodeSize == graph.maxNodeSize ||
       graph.nodeSizeStep == -Infinity ||
       graph.nodeSizeStep == 0
      )
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

    let chartData = {
      labels: [],
      datasets: [
        {data: [], backgroundColor: '#00BCD4', borderWidth: 0}
      ]
    };

    let defaultValue = [0, 100];
    let step = this.state.step;

    if(graph.minNodeSize) {
      defaultValue = [graph.minNodeSize, graph.maxNodeSize];
      step = graph.nodeSizeStep;

      const resolution = parseInt((graph.maxNodeSize - graph.minNodeSize) / graph.nodeSizeStep);
      chartData.labels = new Array(resolution);
      chartData.datasets[0].data = new Array(resolution).fill(0);

      graph.nodes.map(e => e.size).forEach(size => {
        const dataPosition = parseInt((size - graph.minNodeSize) / graph.nodeSizeStep);
        chartData.datasets[0].data[dataPosition] += 1;
      });

      if(appState.ui.componentOptions &&
         appState.ui.componentOptions.nodeSize &&
         appState.ui.componentOptions.nodeSize.yScale &&
         appState.ui.componentOptions.nodeSize.yScale == 'log') {
        chartData.datasets[0].data.forEach((val, index) => {
          chartData.datasets[0].data[index] = Math.log(val);
        });
      }

    }

    if(this.state.min != null) {
      defaultValue = [this.state.min, this.state.max];
    }

    return (<div key={'filterNodeSize-' + network.get("graph").refresh} style={{padding: 10}}>
      <p><span>Node Size</span></p>
      <Bar
        data={chartData}
        height={50}
        options={chartOptions}
      />
      <Range
        key={'nodeSize-' + appState.graph.refresh }
        defaultValue={defaultValue}
        min={graph.minNodeSize}
        max={graph.maxNodeSize}
        step={step}
        onAfterChange={this._handleSlider}
        tipFormatter={value => parseInt(value)}
      />
    </div>);

  }

}
