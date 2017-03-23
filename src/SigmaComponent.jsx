import React, { Component } from 'react';
import { observer } from 'mobx-react';
import mobx from 'mobx';
import { Sigma, LoadJSON, Filter, ForceAtlas2, RelativeSize, RandomizeNodePositions } from 'react-sigma';

import SigmaLoader from './SigmaLoader';

@observer
export default class SigmaComponent extends Component {

  constructor(props) {
    super(props)
    this.hideInfoBox = this.hideInfoBox.bind(this);
    this.displayInfoBox = this.displayInfoBox.bind(this);
  }

  displayInfoBox(e) {
    this.props.appState.selectGraphNode(e.data.node);
  }

  hideInfoBox() {
    this.props.appState.hideRightDrawer();
  }

  render() {

    const appState = this.props.appState;

    const styles = {
      sigma: {
        minHeight: '100%',
        height: '100%',
        width: '100%',
      }
    };

    if(!appState.selectedNetwork)
      return null;

    return (
      <div>
        <Sigma
          renderer={ appState.ui.renderer }
          onClickNode={ this.displayInfoBox }
          onClickStage={ this.hideInfoBox }
          style={styles.sigma}
        >
          <SigmaLoader graph={mobx.toJS(appState.selectedNetwork.graph)}>
            <RandomizeNodePositions>
              <Filter neighborsOf={ appState.graph.isFiltered ? appState.graph.selectedNode : null } />
              <ForceAtlas2 barnesHutOptimize barnesHutTheta={0.8} iterationsPerRender={2}/>
              <RelativeSize initialSize={15}/>
            </RandomizeNodePositions>
          </SigmaLoader>
        </Sigma>
      </div>
    );
  }
};
