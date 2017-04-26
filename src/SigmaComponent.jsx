import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { observer, toJS } from 'mobx-react';
import mobx from 'mobx';
import moment from 'moment';
import { Sigma, LoadJSON, Filter, ForceAtlas2, RelativeSize, RandomizeNodePositions } from 'react-sigma';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import SigmaLoader from './Sigma/Loader';
import ForceLink from './Sigma/ForceLink'

@observer
export default class SigmaComponent extends Component {

  constructor(props) {
    super(props)
    this.selectStage = this.selectStage.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.filterEdges = this.filterEdges.bind(this);
  }

  selectNode(e) {
    this.props.appState.selectGraphNode(e.data.node.id);
  }

  selectStage() {
    this.props.appState.unselectGraphNode();
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

    if(!network || !network.has('graph'))
      return null;

    let backgroundColor = lightBaseTheme.palette.canvasColor;
    if(appState.ui.muiTheme) {

      switch(appState.ui.muiTheme) {
        case 'light':
          backgroundColor = lightBaseTheme.palette.canvasColor;
          break;
        case 'dark':
          backgroundColor = darkBaseTheme.palette.canvasColor;
          break;
      }

    }

    const styles = {
      sigma: {
        minHeight: '100%',
        height: '100%',
        width: '100%',
        background: backgroundColor,
      }
    };

    let sigmaPlugins = [];

    const options = mobx.toJS(network.get('options'));

    if(options.filters) {
      sigmaPlugins.push(<Filter key='sigma-filter' neighborsOf={ appState.graph.isFiltered ? appState.graph.selectedNode : null } nodesBy={this.filterNodes.bind(this, appState.ui.filters.nodeSize)} edgesBy={this.filterEdges.bind(this, appState.ui.filters.edgeSize)} />);
    }

    if(options.relativeSize) {
      sigmaPlugins.push(<RelativeSize initialSize={15} key='sigma-relativesize'/>);
    }

    switch(options.layout) {
      case 'forceatlas2':
        sigmaPlugins.push(<ForceAtlas2 key='sigma-forceatlas2' barnesHutOptimize barnesHutTheta={0.8} iterationsPerRender={2}/>);
        break;
      case 'forcelink':
        sigmaPlugins.push(<ForceLink key='sigma-forcelink' appState={appState} shouldStart={appState.layout.shouldStart} shouldStrop={appState.layout.shouldStop}/>);
        break;
    }

    return (<div>
      <Sigma
        renderer={ appState.ui.renderer }
        onClickNode={ this.selectNode }
        onClickStage={ this.selectStage }
        style={styles.sigma}
        settings={{
          hideEdgesOnMove:false,
          animationsTime:3000,
          clone: false
        }}
      >
        <SigmaLoader graph={network.get('graph')}>
          {sigmaPlugins}
        </SigmaLoader>
      </Sigma>
    </div>);
  }
};
