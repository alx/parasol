import React from 'react';

export default class SigmaLoader extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {loaded: false};
  }

  componentDidMount() {
    this._load(this.props.graph)
  }

  componentWillReceiveProps(props) {
    if(props.graph !== this.props.sigma.graph) {
      this.setState({loaded:false})
      this._load(props.graph)
    }
  }

  embedProps(elements, extraProps) {
    return React.Children.map(elements, (element) => React.cloneElement(element, extraProps))
  }

  render() {
    if(!this.state.loaded)
      return null
    return <div>{ this.embedProps(this.props.children, {sigma: this.props.sigma}) }</div>
  }

  _load(graph) {
    if( graph && typeof(this.props.sigma) != 'undefined' ) {
      this.props.sigma.graph.clear();
      this.props.sigma.graph.read(graph);
      this.props.sigma.refresh();
    }
    this.setState({loaded:true})
  }

}
