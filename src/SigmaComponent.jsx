import React, { Component } from 'react';
import { observer } from 'mobx-react';
import mobx from 'mobx';
import { Sigma, LoadJSON, Filter, ForceAtlas2, ForceLink, RelativeSize, RandomizeNodePositions } from 'react-sigma';

import SigmaLoader from './SigmaLoader';

@observer
export default class SigmaComponent extends Component {

  constructor(props) {
    super(props)
    this.hideInfoBox = this.hideInfoBox.bind(this);
    this.displayInfoBox = this.displayInfoBox.bind(this);
    this.filterEdges = this.filterEdges.bind(this);
  }

  displayInfoBox(e) {
    this.props.appState.selectGraphNode(e.data.node);
  }

  hideInfoBox() {
    this.props.appState.hideRightDrawer();
  }

  filterNodes(size, node) {
    return node.size > size;
  }

  filterEdges(size, edge) {
    return edge.size > size;
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;

    const styles = {
      sigma: {
        minHeight: '100%',
        height: '100%',
        width: '100%',
      }
    };

    if(!network)
      return null;

    let sigmaPlugins = [
      <Filter neighborsOf={ appState.graph.isFiltered ? appState.graph.selectedNode : null } nodesBy={this.filterNodes.bind(this, appState.ui.filters.nodeSize)} edgesBy={this.filterEdges.bind(this, appState.ui.filters.edgeSize)} />,
      <RelativeSize initialSize={15}/>,
    ];

    if(network.options.startForce) {
      sigmaPlugins.push(<ForceAtlas2 barnesHutOptimize barnesHutTheta={0.8} iterationsPerRender={2}/>);
      //sigmaPlugins.push[<ForceLink background easing="cubicInOut"/>];
    }

    if(network.options.randomizeNodePosition)
      sigmaPlugins = <RandomizeNodePositions>{sigmaPlugins}</RandomizeNodePositions>

    return (
      <div>
        <Sigma
          renderer={ appState.ui.renderer }
          onClickNode={ this.displayInfoBox }
          onClickStage={ this.hideInfoBox }
          style={styles.sigma}
        >
          <LoadJSON path={network.url}>{sigmaPlugins}</LoadJSON>
        </Sigma>
      </div>
    );
  }
};
