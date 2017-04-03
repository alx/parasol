import React from 'react';

import {debounce} from 'throttle-debounce';

export default class FilterSettings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      nodeSize: props.appState.ui.filters.nodeSize,
      edgeSize: props.appState.ui.filters.nodeSize,
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
      edgeSize: props.appState.ui.filters.nodeSize,
    });
  }

  render() {

    return null;

  }

}
