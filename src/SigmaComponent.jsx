import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Sigma, LoadJSON, Filter, ForceAtlas2, RelativeSize, RandomizeNodePositions } from 'react-sigma';

@observer
export default class SigmaComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {selectedNode: null}
  }

  render() {

    return (
      <div>
        <Sigma renderer="webgl" onClickNode={ e => this.setState({selectedNode: e.data.node.id}) } onClickStage={ e => this.setState({selectedNode: null}) }>
          <LoadJSON path={"/hansa.json"}>
            <RandomizeNodePositions>
              <Filter neighborsOf={ this.state.selectedNode } />
              <ForceAtlas2 barnesHutOptimize barnesHutTheta={0.8} iterationsPerRender={2}/>
              <RelativeSize initialSize={15}/>
            </RandomizeNodePositions>
          </LoadJSON>
        </Sigma>
      </div>
    );
  }
};
