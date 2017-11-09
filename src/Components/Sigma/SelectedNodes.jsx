import { Component } from 'react';
import { observer } from 'mobx-react';

@observer
export default class SelectedNodes extends Component {
  constructor(props) {
    super(props)

    props.nodes.forEach( (node, index) => {
      props.sigma.graph.addNode({
        id: 'selectedNode-' + index,
        x: node.x,
        y: node.y,
        size: node.size * 1.3,
        color: '#000'
      });
    });
  }

  render = () => null
}
