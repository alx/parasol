import Eth from 'ethjs';
import EthQuery from 'ethjs-query';
import BlockTracker from 'eth-block-tracker';
import EthFilter from 'ethjs-filter';

const BN = require('bn.js');

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
  ethQuery = new EthQuery(window.web3.currentProvider);
  filters = new EthFilter(this.ethQuery);

  graph = {
    nodes: [],
    edges: [],
    refresh: Math.random()
  }

  constructor(network, muiTheme, options) {
    this.network = network;
    this.options = options;
  }

  _initGraph() {
    this.network.set('source_graph', this.graph);
    this.network.set('graph', this.graph);
  }

  _refreshGraph() {

    const current_nodes = this.network.get('graph').nodes;
    this.graph.nodes.forEach(node => {
      const current_node = current_nodes.find(n => n.id == node.id);
      if(current_node) {
        node.x = current_node.x;
        node.y = current_node.y;
      }
    });

    this.graph.refresh = Math.random();

    if(this.options.nodeLimit && this.graph.nodes.length > this.options.nodeLimit) {
      this.graph.nodes = this.graph.nodes
        .sort((a, b) => b.size - a.size)
        .slice(0, this.options.nodeLimit);
      this.graph.edges = this.graph.edges
        .filter(e => {
          return this.graph.nodes.includes(e.source) &&
            this.graph.nodes.includes(e.target);
        });
    }

    if(this.graph.nodes.length > 0) {
      const nodeSizes = this.graph.nodes.map(node => node.size);
      this.graph.minNodeSize = Math.ceil(Math.min.apply(Array, nodeSizes));
      this.graph.maxNodeSize = Math.ceil(Math.max.apply(Array, nodeSizes));
      this.graph.nodeSizeStep = (this.graph.maxNodeSize - this.graph.minNodeSize) / 100.0;
    }

    if(this.graph.edges.length > 0) {
      const edgeWeights = this.graph.edges.map(edge => edge.weight);
      const minEdgeWeight = Math.min.apply(Array, edgeWeights);
      this.graph.minEdgeWeight = minEdgeWeight != Infinity ? minEdgeWeight : 0;
      const maxEdgeWeight = Math.max.apply(Array, edgeWeights);
      this.graph.maxEdgeWeight = maxEdgeWeight != -Infinity ? maxEdgeWeight : 0;
      this.graph.edgeWeightStep = (this.graph.maxEdgeWeight - this.graph.minEdgeWeight) / 100.0;
    }

    this.network.set('source_graph', this.graph);
    this.network.set('graph', this.graph);
  }

  _createNode(node_id, metadata, increment = 1) {

    if(!node_id || node_id.length == 0)
      return null;

    let node = this.graph.nodes.find(n => n.id == node_id);
    if(node) {
      node.size += increment;
    } else {
      this.graph.nodes.push({
        id: node_id,
        size: increment,
        x: Math.random(),
        y: Math.random(),
        color: COLORS.nodes[metadata.category],
        metadata: metadata,
      });
    }
  }

  _createEdge(content) {
    if(this.graph.nodes.find(n => n.id == content.source) &&
       this.graph.nodes.find(n => n.id == content.target)) {
      this.graph.edges.push(Object.assign({},
        {id: `e${this.graph.edges.length + 1}`},
        content));
    }
  }


  onBlock(block) {
    const block_number = parseInt(new BN(block.number.replace('0x', ''), 16).toString(10))
    this._createNode(block.hash, {category: 'block', number: block_number}, block.transactions.length);
    this._createNode(block.parentHash, {category: 'block'});
    this._createEdge({
      source: block.parentHash,
      target: block.hash,
      type: 'block'
    });
    this._refreshGraph();
  }

    //this._createNode(block.hash, {category: 'block'});
    //this._createNode(block.parentHash, {category: 'block'});

    //this._createEdge({
    //  source: block.hash,
    //  target: block.parentHash,
    //  type: 'block',
    //  hidden: true
    //});

  graphBlockTransaction(block) {

    block.transactions.forEach(transaction => {
      this._createNode(transaction.hash, {category: 'transaction'});
      this._createNode(transaction.from, {category: 'address'});
      this._createNode(transaction.to, {category: 'address'});

      //this._createEdge({
      //    source: block.hash,
      //    target: transaction.hash,
      //    type: 'transaction'
      //});
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

  graphWalletTransaction(transaction) {
    console.log(transaction);
    this._refreshGraph();
  }

  run(callback) {

    this._initGraph();

    let mode = "blockstream";

    if(this.options.blocks && this.options.blocks.length > 0)
      mode = "transactionMerge";

    if(this.options.wallets && this.options.wallets.length > 0)
      mode = "walletMerge";

    switch(mode) {
      case "walletMerge":
        console.log('walletmerge');
        const filter = new this.filters.Filter({ delay: 300 })
        //.new({ address: "0xe812a332eee4f70268062bb28e19ccdf5a649b4a" })
          .new({ toBlock: 500 })
          .then((result) => {
            console.log('filter ', result)
          })
          .catch((error) => {
            console.log('error ', error);
          });
          filter.watch(this.graphWalletTransaction.bind(this));
        break;
      case "transactionMerge":
        this.network.set('categories', [
          {name: 'transaction', color: amber500},
          {name: 'address', color: green500},
        ]);
        this.options.blocks.forEach( blockNumber => {
          this.eth.getBlockByNumber(blockNumber, true)
            .then(this.graphBlockTransaction.bind(this));
        });
        break;
      case "blockstream":
      default:
        this.network.set('categories', [
          {name: 'block', color: cyan500},
        ]);
        this.blockTracker.on('block', this.onBlock.bind(this));
        this.blockTracker.start()
        break;
    }

    if(typeof(callback) != 'undefined')
      callback(this.network);
  }

  stop() {
    this.blockTracker.stop()
  }

}

