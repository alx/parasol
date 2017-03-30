import React, { Component } from 'react';
import { observer } from 'mobx-react';
import mobx from 'mobx';
import moment from 'moment';
import { Sigma, LoadJSON, Filter, ForceAtlas2, ForceLink, RelativeSize, RandomizeNodePositions } from 'react-sigma';

import SigmaLoader from './Sigma/Loader';
import SigmaPluginsContainer from './Sigma/PluginsContainer';

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

    if(!network || !network.url)
      return null;

    let sigmaPlugins = [];

    if(network.options.filters) {
      sigmaPlugins.push(<Filter key='sigma-filter' neighborsOf={ appState.graph.isFiltered ? appState.graph.selectedNode : null } nodesBy={this.filterNodes.bind(this, appState.ui.filters.nodeSize)} edgesBy={this.filterEdges.bind(this, appState.ui.filters.edgeSize)} />);
    }

    if(network.options.relativeSize) {
      sigmaPlugins.push(<RelativeSize initialSize={15} key='sigma-relativesize'/>);
    }

    if(network.options.startForce) {
      sigmaPlugins.push(<ForceAtlas2 key='sigma-forceatlas2' barnesHutOptimize barnesHutTheta={0.8} iterationsPerRender={2}/>);
      //sigmaPlugins.push[<ForceLink background easing="cubicInOut"/>];
    }

    if(network.options.randomizeNodePosition) {
      sigmaPlugins = <RandomizeNodePositions key={moment(network.timestamp).valueOf()}>{sigmaPlugins}</RandomizeNodePositions>
    } else {
      sigmaPlugins = <SigmaPluginsContainer key={moment(network.timestamp).valueOf()}>{sigmaPlugins}</SigmaPluginsContainer>
    }

    return (
      <div>
        <Sigma
          renderer={ appState.ui.renderer }
          onClickNode={ this.displayInfoBox }
          onClickStage={ this.hideInfoBox }
          style={styles.sigma}
        >
          <SigmaLoader graph={network.graph}>{sigmaPlugins}</SigmaLoader>
        </Sigma>
      </div>
    );
  }
};
