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

  constructor(network, muiTheme, options) {
    this.eth = new Eth(window.web3.currentProvider);
    const provider = window.web3.currentProvider;
    this.blockTracker = new BlockTracker({ provider });
    this.network = network;
    this.muiTheme = muiTheme;
    this.options = options;
    this._sizeOrCreateNode = this._sizeOrCreateNode.bind(this);
  }

  sizeOrCreateAddressNode(graph, node_id) {
    let node = graph.nodes.find(n => n.id == node_id);
    this.eth.getBalance(node_id, function(error, result) {
      if(node) {
          node.size = result.toNumber();
      } else {
        graph.nodes.push({
          id: node_id,
          size: result.toNumber(),
          x: Math.random(),
          y: Math.random(),
          color: COLORS.nodes['address'],
          metadata: {
            category: category
          }
        });
      }
    });
  }

  _sizeOrCreateNode(graph, node_id, category, increment = 1) {
    ////console.log('add node ' + category + '-' + increment);
    //console.log(node_id);
    let node = graph.nodes.find(n => n.id == node_id);
    if(node) {
      node.size +=increment;
    } else {
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
  }

  run(callback) {

    const self = this;
    const network = this.network;
    let categories = [];
    console.log('load');

    let nodesToCreate = [];
    let edgesToCreate = [];

    this.blockTracker.on('block', (block) => {
      let graph = self.network.get('graph');
      if(!graph) {
        graph = {nodes: [], edges: []};
      }
      let edgeCount = graph.edges.length;

      self._sizeOrCreateNode(graph, block.hash, 'block');
      self._sizeOrCreateNode(graph, block.parentHash, 'block');

      graph.edges.push({
        id: `e${edgeCount += 1}`,
        source: block.hash,
        target: block.parentHash,
        type: 'block'
      });
      console.log(graph.nodes.length);
      graph.refresh = Math.random();
      self.network.set('source_graph', graph);
      self.network.set('graph', graph);
    });
    this.blockTracker.start()

    //const filter = new this.filters.Filter({ delay: 300 })
    //.new({ toBlock: 500 })
    //.then((result) => {
    //  debugger;
    //  // result <BigNumber ...> filterId
    //})
    //.catch((error) => {
    //  debugger;
    //  // result null
    //});
    //filter.watch((result) => {
    //  console.log(result);
    //  // result [{...}, ...] (fires multiple times)
    //});
    ////filter.uninstall(cb);


    //this.eth.getBlock('latest', function(error, result) {
    //  if(!error) {
    //    let graph = network.get('graph');

    //    if(!graph) {
    //      graph = {nodes: [], edges: []};
    //    }

    //    let edgeCount = graph.edges.length;

    //    self._sizeOrCreateNode(graph, result.hash, 'block');
    //    self._sizeOrCreateNode(graph, result.parentHash, 'block');

    //    graph.edges.push({
    //      id: `e${edgeCount += 1}`,
    //      source: result.hash,
    //      target: result.parentHash,
    //      type: 'block'
    //    });

    //    result.transactions.forEach(tHash => {

    //      self._sizeOrCreateNode(graph, tHash, 'transaction');

    //      graph.edges.push({
    //        id: `e${edgeCount += 1}`,
    //        source: result.hash,
    //        target: result.tHash,
    //        type: 'transaction'
    //      });
    //      //console.log(graph);

    //      self.eth.getTransaction(tHash, function(error, result){
    //        if(!error) {
    //          self._sizeOrCreateNode(graph, tHash, 'transaction', result.value);
    //          if(result.from) {
    //            self._sizeOrCreateNode(graph, result.from, 'address');
    //            graph.edges.push({
    //              id: `e${edgeCount += 1}`,
    //              source: tHash,
    //              target: result.from,
    //              type: 'transaction_from'
    //            });
    //          }
    //          if(result.to) {
    //            self._sizeOrCreateNode(graph, result.to, 'address');

    //            graph.edges.push({
    //              id: `e${edgeCount += 1}`,
    //              source: tHash,
    //              target: result.to,
    //              type: 'transaction_to'
    //            });
    //          }

    //          //console.log(graph);
    //          network.set('graph', graph);

    //        } else {
    //          console.error('getTransaction error', error);
    //        }
    //      });
    //    });

    //  } else {
    //    console.error('getBlock latest error', error);
    //  }
    //})

  }

}
