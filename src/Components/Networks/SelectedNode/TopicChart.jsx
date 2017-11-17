import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import {Bar} from 'react-chartjs-2';

export default class TopicChart extends Component {

  render() {

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
      labels: this.props.topics.map(cat => cat.name),
      datasets: [
        {
          data: this.props.data,
          backgroundColor: this.props.topics.map(cat => cat.color),
          borderWidth: 0
        }
      ]
    };

    return <ListItem
      key={`selectednode-topicChart-${this.props.title}`}
      secondaryText={`Topic Chart - ${this.props.title.replace('metadata.','')}`}
      innerDivStyle={{margin: 0, padding: '10 8 8'}}
    >
      <Bar
        key={`chartjs-${this.props.title}`}
        type={'horizontalBar'}
        data={chartData}
        height={50}
        options={chartOptions}
      />
    </ListItem>;
  }
}
