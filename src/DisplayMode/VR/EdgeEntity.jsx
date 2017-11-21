import React, { Component } from 'react';
import { observer } from 'mobx-react';

import 'aframe';
import {Entity} from 'aframe-react';
import 'aframe-meshline-component';

@observer
export default class edgeEntity extends React.Component {

  render () {

    const edge = this.props.edge;

    if(!edge)
      return null;

    const source = `${edge.source.x} ${edge.source.y} -150`;
    const target = `${edge.target.x} ${edge.target.y} -150`;

    return (<Entity
      meshline={{
        lineWidth: 2,
        path: [source, target].join(','),
        color: '#37474f'
      }} />);

  }
}
