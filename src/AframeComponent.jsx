import React, { Component } from 'react';

import 'aframe';
import 'aframe-particle-system-component';
import {Entity, Scene} from 'aframe-react';

export default class VRScene extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 0, y: 0, z: -5}}/>
        <Entity particle-system={{preset: 'snow'}}/>
        <Entity light={{type: 'point'}}/>
        <Entity text={{value: 'Hello, WebVR!'}}/>
      </Scene>
    );
  }
}
