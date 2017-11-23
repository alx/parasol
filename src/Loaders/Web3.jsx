import async from 'async';
import Eth from 'ethjs';
import BlockTracker from 'eth-block-tracker';

import {
  green500,
  deepOrange500,
  deepPurple500,
  pink500,
  amber500,
  cyan500,
  brown500,
  grey500,
  blueGrey100,
  blueGrey800,
} from 'material-ui/styles/colors';

const COLORS = {
  nodes: {
    block: cyan500,
    transaction: amber500,
    address: green500,
  },
  edge: {
    dark: blueGrey800,
    light: blueGrey100,
  },
};

export default class Web3 {

  network = null;
  options = null;

  eth = new Eth(window.web3.currentProvider);
  blockTracker = new BlockTracker({
    provider: window.web3.currentProvider
  });

  constructor(network, muiTheme, options) {
    this.network = network;
    this.options = options;
  }

  _initGraph() {
    let graph = this.network.get('graph');
    if(!graph) {
      graph = {nodes: [], edges: []};
    }
    this.network.set('source_graph', graph);
    this.network.set('graph', graph);
  }

  _refreshGraph() {
    let graph = this.network.get('graph');
    graph.refresh = Math.random();
    this.network.set('source_graph', graph);
    this.network.set('graph', graph);
  }

  _sizeOrCreateNode(node_id, category, increment = 1) {

    if(!node_id || node_id.length == 0)
      return null;

    let graph = this.network.get('graph');
    let node = graph.nodes.find(n => n.id == node_id);
    if(node) {
      node.size += increment;
    } else {
      console.log(node_id + '-' + category);
      graph.nodes.push({
        id: node_id,
        size: 1,
        x: Math.random(),
        y: Math.random(),
        color: COLORS.nodes[category],
        metadata: {
          category: category
        }
      });
    }
    this.network.set('source_graph', graph);
    this.network.set('graph', graph);
  }

  _createEdge(content) {
    let graph = this.network.get('graph');
    if(graph.nodes.find(n => n.id == content.source) &&
       graph.nodes.find(n => n.id == content.target)) {
      graph.edges.push(Object.assign({},
        {id: `e${graph.edges.length + 1}`},
        content));
    }
    this.network.set('source_graph', graph);
    this.network.set('graph', graph);
  }


  onBlock(block) {

    this._sizeOrCreateNode(block.hash, 'block');
    this._sizeOrCreateNode(block.parentHash, 'block');

    this._createEdge({
      source: block.hash,
      target: block.parentHash,
      type: 'block'
    });

    block.transactions.forEach(transaction => {

      this._sizeOrCreateNode(transaction.hash, 'transaction');
      this._createEdge({
          source: block.hash,
          target: transaction.hash,
          type: 'transaction'
      });

      this._sizeOrCreateNode(transaction.from, 'address');
      this._sizeOrCreateNode(transaction.to, 'address');
      this._createEdge({
        source: transaction.from,
        target: transaction.hash,
        type: 'transaction'
      });
      this._createEdge({
        source: transaction.hash,
        target: transaction.to,
        type: 'transaction'
      });
    });

    this._refreshGraph();
  }

  run(callback) {
    console.log('run web3 loader');
    this._initGraph();
    this.blockTracker.on('block', this.onBlock.bind(this));
    this.blockTracker.start()
  }

}
