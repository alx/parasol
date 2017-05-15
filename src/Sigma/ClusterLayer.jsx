import React, { Component } from 'react';

export default class ClusterLayer extends Component {
  constructor(props) {
    super(props)

    const renderer = props.sigma.renderers[0];
    const context = renderer.domElements.scene.getContext('2d');
    this.state = {context: context};

    renderer.bind('render', this.bindSigmaRender.bind(this));
  }

  bindSigmaRender(event) {

    const scene = event.target.domElements.scene;
    const context = scene.getContext('2d');
    const camera = event.target.camera;

    const position = camera.graphPosition(100, 100);
    context.fillStyle = "rgba(200,100,200, 0.5)";
    context.fillRect(position.x, position.y, 100, 100);

  }

  render = () => { return null; }
}
