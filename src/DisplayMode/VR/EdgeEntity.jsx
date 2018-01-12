import React, { Component } from 'react';
import { observer } from 'mobx-react';

import 'aframe';
import {Entity} from 'aframe-react';
import 'aframe-meshline-component';

import './materialSmoothCircle.js';

@observer
export default class edgeEntity extends React.Component {

  render () {

    let seed = function(s) {
      return Math.sin(s);
    };

    const edge = this.props.edge;
    const time = 15000;

    if(!edge)
      return null;

    const sourceZ = seed(edge.source.x + edge.source.y) * 100 - 150;
    const targetZ = seed(edge.target.x + edge.target.y) * 100 - 150;

    //const source = `${edge.source.x} ${edge.source.y} -150`;
    //const target = `${edge.target.x} ${edge.target.y} -150`;
    const source = `${edge.source.x} ${edge.source.y} ${sourceZ}`;
    const target = `${edge.target.x} ${edge.target.y} ${targetZ}`;

    return (<Entity>
      <Entity
      meshline={{
        lineWidth: 0.75,
        path: [source, target].join(','),
        color: '#777'
      }}/>
        <Entity
          key={`edge-anim-${edge.id}`}
          geometry={{
            primitive: 'plane',
            width: 5,
            height: 5
          }}
          material={{
            shader: 'smooth-circle',
            transparent: 'true',
            depthTest: 'false',
            color: 'white',
            alpha: 0.2,
            blur: 0.2
          }}
          look-at={{src: '#target'}}
          position={{
            x: (edge.source.x + edge.target.x) / 2,
            y: (edge.source.y + edge.target.y) / 2,
            z: -150
          }}>
            <a-animation
              easing='linear'
              dur={time / edge.size}
              attribute='position'
              from={source} to={target}
              repeat='indefinite'/>
        </Entity>
      </Entity>
    );
  }
}
