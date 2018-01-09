import React, { Component } from 'react';
import { observer } from 'mobx-react';

import 'aframe';
import {Entity} from 'aframe-react';

import './materialSmoothCircle.js';
import './lookAt.js';

@observer
export default class NodeEntity extends React.Component {

  render () {

    let seed = function(s) {
      return Math.sin(s);
    };

    const node = this.props.node;

    if(!node)
      return null;

    return (<Entity
      key={`node-${node.id}`}
      geometry={{
        primitive: 'plane',
        width: node.size / 1.5,
        height: node.size / 1.5
      }}
      material={{
        shader: 'smooth-circle',
        transparent: 'true',
        depthTest: 'false',
        color: node.color || 'red'
      }}
      look-at={{src: '#target'}}
      position={{x: node.x, y: node.y, z: (seed(node.x + node.y) * 100) - 150.0}}
    >
      <Entity
        look-at={{src: '#target'}}
        position={{x: 40, y: 10, z: 0}}
        text={{align: 'left', width: 100, value: node.label }}
        wrap-count="10"/>
      </Entity>
    );
  }
}
