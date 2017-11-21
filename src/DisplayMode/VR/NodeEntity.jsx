import React, { Component } from 'react';
import { observer } from 'mobx-react';

import 'aframe';
import {Entity} from 'aframe-react';

@observer
export default class NodeEntity extends React.Component {

  render () {

    const node = this.props.node;

    if(!node)
      return null;

    return (<Entity
      key={`node-${node.id}`}
      geometry={{primitive: 'sphere', radius: node.size / 2}}
      material={{color: node.color || 'red'}}
      position={{x: node.x, y: node.y, z: -150}}
    />);

  }
}
