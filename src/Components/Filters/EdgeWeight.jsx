import React, {Component} from 'react';
import { observer } from 'mobx-react';

import {Bar} from 'react-chartjs-2';

require('rc-slider/assets/index.css');
require('rc-tooltip/assets/bootstrap.css');

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

@observer
export default class EdgeWeight extends Component {

  constructor(props) {
    super(props)
    this.state = {
      key: 0,
      step: 100,
      min: null,
      max: null
    }
    this._handleSlider = this._handleSlider.bind(this);
  }

  _handleSlider = (range) => {
    this.setState({min: range[0], max: range[1]});
    this.props.appState.setFilter({
      minEdgeWeight: range[0],
      maxEdgeWeight: range[1],
    });
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    if(!network || !network.has('source_graph'))
      return null;

    const graph = network.get('source_graph');

    if(graph.edges.length == 0 ||
       graph.edges.filter(e => e.weight && e.weight > 0).length == 0)
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

    if(graph.minEdgeWeight) {
      defaultValue = [graph.minEdgeWeight, graph.maxEdgeWeight];
      step = graph.edgeWeightStep;

      const resolution = parseInt((graph.maxEdgeWeight - graph.minEdgeWeight) / graph.edgeWeightStep);
      chartData.labels = new Array(resolution);
      chartData.datasets[0].data = new Array(resolution).fill(0);

      graph.edges.map(e => e.weight).forEach(weight => {
        const dataPosition = parseInt((weight - graph.minEdgeWeight) / graph.edgeWeightStep);
        chartData.datasets[0].data[dataPosition] += 1;
      });

      if(appState.ui.componentOptions &&
         appState.ui.componentOptions.edgeWeight &&
         appState.ui.componentOptions.edgeWeight.yScale &&
         appState.ui.componentOptions.edgeWeight.yScale == 'log') {
        chartData.datasets[0].data.forEach((val, index) => {
          chartData.datasets[0].data[index] = Math.log(val);
        });
      }

    }

    if(this.state.min != null) {
      defaultValue = [this.state.min, this.state.max];
    }


    return (<div key={'filterEdgeWeight-' + appState.graph.refresh} style={{padding: 10}}>
      <p><span>Edge Weight</span></p>
      <Bar
        data={chartData}
        height={50}
        options={chartOptions}
      />
      <Range
        key={'edgeWeight'}
        defaultValue={defaultValue}
        min={graph.minEdgeWeight}
        max={graph.maxEdgeWeight}
        step={step}
        onAfterChange={this._handleSlider}
        tipFormatter={value => value.toFixed(2)}
      />
    </div>);

  }

}
