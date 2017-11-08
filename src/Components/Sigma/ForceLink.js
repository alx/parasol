/* eslint indent: "off", no-mixed-spaces-and-tabs: "off"*/

import React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import './layout.forceLink';

/**

  ForceLink component, starts Force Atlas2 algorythm once component is mounted,
  it is advanced version of ForceAtlas2 plugin, but it is not included in the main
  distribution script react-sigma.min.js , rather should be imported explicitly:

  ```
  import ForceLink from 'react-sigma/lib/ForceLink'
  ```

  It accepts all the parameters of ForceLink described on its github page:
@param {boolean} barnesHutOptimize  Use the algorithm's Barnes-Hut to improve repulsion's scalability
This is useful for large graph but harmful to small ones.
@param {number} barnesHutTheta
@param {boolean} adjustSizes
@param {number} iterationsPerRender
@param {boolean} [linLogMode=true]
@param {boolean} outboundAttractionDistribution
@param {number} edgeWeightInfluence
@param {number} scalingRatio
@param {boolean} strongGravityMode
@param {number} gravity
@param {boolean} alignNodeSiblings
@param {number} nodeSiblingsScale
@param {number} nodeSiblingsAngleMin
@param {boolean} [worker=true]  Use a web worker to run calculations in separate thread
@param {boolean} background
@param {Sigma$Easing} easing  Easing mode
@param {"globally"|"locally"} randomize  Randomize node positions before start
@param {number} slowDown
@param {number} timeout   how long algorythm should run. default=graph.nodes().length * 10

[see sigma plugin page for more details](https://github.com/Linkurious/linkurious.js/tree/develop/plugins/sigma.layouts.forceLink)

@example
import ForceLink from 'react-sigma/lib/ForceLink'
...
<Sigma>
<LoadJSON path="/public/graph.json">
<RelativeSize initialSize={8}/>
<ForceLink background easing="cubicInOut"/>
</LoadJSON>
</Sigma>

 **/

@observer
class ForceLink extends React.Component {

  static _propsChanged(prev, next) {
    for (const key in prev) if (prev[key] !== next[key]) return true;
    return false;
  }

  // strip force atlas options from component props
  static _stripOptions(props) {
    return Object.assign({}, props, { sigma: undefined });
  }

  constructor(props) {
    super(props);

    this.render = () => null;

    this.state = { running: false };

    this._stopLayout = this._stopLayout.bind(this);
  }

  componentDidMount() {
    this._refreshGraph();
  }

  // Change sigma status only after react rendering complete
  componentDidUpdate(prevProps, prevState) {
    const s = this.props.sigma;
    if (this.props.shouldStop) {
      this._stopForceLink();
      s.refresh();
    } else if (prevState.running && !this.state.running && s) {
      this._stopForceLink();
      s.refresh();
    } else if (ForceLink._propsChanged(prevProps, this.props) && this.props.shouldStart) {
      this._stopForceLink();
      this._refreshGraph();
    }
  }

  componentWillUnmount() {
    this._stopForceLink();
  }

  // TODO: Add composition of child components after timeout

  _stopForceLink() {
    sigma.layouts.stopForceLink();
    if (this.state.timer) clearTimeout(this.state.timer);
    if (this.props.sigma && this.props.sigma.settings) this.props.sigma.settings({ drawEdges: this.state.drawEdges });
  }

  _refreshGraph() {

    const appState = this.props.appState;

    const s = this.props.sigma;
    if (!sigma || !s || !appState) return;

    const drawEdges = s.settings('drawEdges');
    if (s.graph.edges().length > 1000) s.settings({ drawEdges: false });

    sigma.layouts.configForceLink(s, mobx.toJS(appState.layout.params));
    // sigma.layouts.configForceLink(s, ForceLink._stripOptions(this.props));
    appState.layoutRunning();
    sigma.layouts.startForceLink(s);
    // TODO: convert running status to state
    const timeout = this.props.timeout || s.graph.nodes().length * 8;
    const timer = setTimeout(this._stopLayout, timeout);
    this.setState({ running: true, timer, drawEdges });
  }

  _stopLayout() {
    this.props.appState.layoutStopped(this.props.sigma.graph.nodes());
    this.setState({ running: false, timer: undefined });
  }

}

ForceLink.defaultProps = {
  linLogMode: true,
  barnesHutTheta: 1,
  gravity:0.5,
  barnesHutOptimize: true,
  linLogMode: true,
  startingIterations: 1,
  strongGravityMode: true
};
ForceLink.propTypes = {
  barnesHutOptimize: require('react').PropTypes.bool,
  barnesHutTheta: require('react').PropTypes.number,
  adjustSizes: require('react').PropTypes.bool,
  iterationsPerRender: require('react').PropTypes.number,
  linLogMode: require('react').PropTypes.bool.isRequired,
  outboundAttractionDistribution: require('react').PropTypes.bool,
  edgeWeightInfluence: require('react').PropTypes.number,
  scalingRatio: require('react').PropTypes.number,
  strongGravityMode: require('react').PropTypes.bool,
  slowDown: require('react').PropTypes.number,
  gravity: require('react').PropTypes.number,
  alignNodeSiblings: require('react').PropTypes.bool,
  nodeSiblingsScale: require('react').PropTypes.number,
  nodeSiblingsAngleMin: require('react').PropTypes.number,
  worker: require('react').PropTypes.bool.isRequired,
  background: require('react').PropTypes.bool,
  easing: require('react').PropTypes.any,
  randomize: require('react').PropTypes.oneOf(['globally', 'locally', 'no']),
  timeout: require('react').PropTypes.number,
  sigma: require('react').PropTypes.any,
  appState: require('react').PropTypes.any,
  shouldStart: require('react').PropTypes.bool,
  shouldStop: require('react').PropTypes.bool
};
export default ForceLink;
