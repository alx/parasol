import React, { Component } from 'react';
import { observer } from 'mobx-react';

import 'aframe';
import {Entity, Scene} from 'aframe-react';

import NodeEntity from './NodeEntity';
import EdgeEntity from './EdgeEntity';

@observer
export default class VRScene extends React.Component {

  render () {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph'))
      return null;

    let graph = network.get('graph');

    return (
      <Scene fog="type: exponential; color: #282828">
        {graph.nodes.filter(n => !n.hidden).map((n, index) => {
          return <NodeEntity
            key={`node-entity-${index}`}
            node={n}/>;
        })}
        {graph.edges.filter(e => !e.hidden).map((e, index) => {
          e.source = graph.nodes.find(n => n.id == e.source);
          e.target = graph.nodes.find(n => n.id == e.target);
          return <EdgeEntity
            key={`edge-entity-${index}`}
            edge={e}/>;
        })}
        <Entity id="target" camera look-controls wasd-controls="acceleration: 700"/>
        <Entity primitive='a-sky' color='#000'/>
      </Scene>
    );
  }
}
