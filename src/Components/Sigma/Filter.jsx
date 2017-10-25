/* eslint indent: "off", no-mixed-spaces-and-tabs: "off"*/

import React from 'react'
import './plugins.filter'

class Filter extends React.Component {

  componentDidMount() {
    this.filter = new sigma.plugins.filter(this.props.sigma)
    this._apply(this.props)
  }

  componentWillUpdate(props: Props) {
    if(props.nodesBy!==this.props.nodesBy || props.neighborsOf!==this.props.neighborsOf)
      this._apply(props)
  }

  render = () => null

  _apply(props: Props) {
    this.filter.undo(["neighborsOf", "nodesBy"])
    if(props.neighborsOf) {
      this.filter.neighborsOf(props.neighborsOf, "neighborsOf")
    }
    if(props.nodesBy)
      this.filter.nodesBy(props.nodesBy, "nodesBy")
    this.filter.apply()
    if(this.props.sigma)
      this.props.sigma.refresh();
  }
}

export default Filter;
