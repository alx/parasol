import { computed, observable, toJS } from 'mobx';
import moment from 'moment';
import color from 'tinycolor2';
import LoaderTsne from './Loaders/Tsne';
import LoaderJson from './Loaders/Json';
import LoaderLdaJson from './Loaders/LdaJson';
import LoaderLombardi from './Loaders/Lombardi';
import LoaderJsonFeed from './Loaders/JsonFeed';
import LoaderWeb3 from './Loaders/Web3';

import FileSaver from 'file-saver';

const LOADERS = {
  dd_tsne: LoaderTsne,
  json: LoaderJson,
  lombardi: LoaderLombardi,
  jsonfeed: LoaderJsonFeed,
  ldajson: LoaderLdaJson,
  web3: LoaderWeb3,
};

class AppState {

  @observable networks = [];
  @observable currentLoader = null;
  @observable selectedNetworkIndex = 0;
  @observable refreshNetwork = Math.random();

  @observable graph = {
    selectedNodes: [],
    isFiltered: false,
    filterMode: 'singlenode',
    minNodeSize: 0,
    maxNodeSize: Infinity,
    minEdgeWeight: 0,
    maxEdgeWeight: Infinity,
    refresh: Math.random(),
    subnetworkLevels: 2,
  };

  @observable ui = {
    drawers: [
      {
        id: 'left',
        open: true,
        openSecondary: false,
        components: [
          {name: 'AppBar'},
          {name: 'NetworkInput'},
          {name: 'NetworkList'},
          {name: 'Divider'},
          {name: 'ForceLinkSettings'},
          {name: 'Divider'},
          {name: 'Legend'},
          {name: 'TopicSelector'},
        ]
      },
      {
        id: 'right',
        open: true,
        openSecondary: true,
        components: [
          {name: 'SearchInput'},
          {name: 'NodeSize'},
          {name: 'EdgeWeight'},
          {name: 'HideOrphan'},
          {name: 'Divider'},
          {name: 'ShowSelected'},
          {name: 'SelectedNode'},
          {name: 'SelectedNodes'},
          {name: 'Divider'},
          {name: 'NeighborNodes'}
        ]
      }
    ],
    renderer: 'canvas',
    filters: {
      edgeLabelSize: 'proportional',
      enableEdgeHovering: true,
      //minNodeSize: 0,
      //maxNodeSize: 0,
      minEdgeWeight: 0,
      maxEdgeWeight: Infinity,
      minArrowSize:4,
      onlyShowSelected: false,
      hideOrphans: false,
      categories: [],
      attributes: [],
      nodes: [],
      topics: [],
    },
    muiTheme: 'dark',
    mode: 'fullscreen',
    labels: {
      //labelThreshold: 10,
      labelSize: 'ratio',
      labelSizeRatio: 2,
      fontStyle: '500',
      font: 'Roboto',
      labelColor: 'node',
      //labelColor: '#000',
    },
    edges: {
      shape: "curve",
    }
  };

  @observable layout = {
    running: false,
    shouldStart: false,
    shouldStop: false,
    params: {
      //startingIterations: 1,
      barnesHutOptimize: true,
      barnesHutTheta: 0.5,
      adjustSizes: false,
      iterationsPerRender: 1,
      linLogMode: true,
      outboundAttractionDistribution: false,
      edgeWeightInfluence: 0,
      scalingRatio: 1,
      strongGravityMode: false,
      gravity: 1,
      alignNodeSiblings: false,
      nodeSiblingsScale: 1,
      nodeSiblingsAngleMin: 0,
      worker: true,
      background: true,
      easing: 'cubicInOut',
      randomize: 'locally',
      slowDown: 1,
      timeout: 1000,
    }
  };

  @observable network_loader = {
    path: '',
    methods: []
  }

  initSettings(settings) {

    if (settings.ui) {
      this.ui = Object.assign(this.ui, settings.ui);
    }

    if (settings.graph) {
      this.graph = Object.assign(this.graph, settings.graph);
    }

    if (settings.networks) {
      const self = this;
      settings.networks.forEach((network, index) => {
        if (index == (settings.networks.length - 1)) {
          // select first imported network when done
          this.initNetwork(network, () => {
            self.selectNetwork(0);
            self.refreshNetwork = Math.random();
          });
        } else {
          this.initNetwork(network, () => {
            self.refreshNetwork = Math.random();
          });
        }
      });
    }

    // if (settings.layout) {
    //   this.layout = Object.assign(this.layout, settings.layout);
    // }

    if (settings.network_loader) {
      this.network_loader = Object.assign(this.network_loader, settings.network_loader);
    }

  }

  /*
  * Network
  */

  @computed get selectedNetwork() {
    return this.networks[this.selectedNetworkIndex];
  }

  clearSelectedNetwork() {
    this.networks.filter(network => network.get('selected'))
                 .forEach(network => {
                   network.set('selected', false);
                 });
  }

  refreshSelectedNetwork() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];
    this.loadNetwork(selectedNetwork, () => {
      this.unselectGraphNode();
      this.selectNetwork(this.selectedNetworkIndex);
    });
  }

  saveSelectedNetwork() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];
    const graph = toJS(selectedNetwork.get('graph'))
    selectedNetwork.set('source_graph', graph);
  }

  downloadSelectedNetwork() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];
    const blob = new Blob([JSON.stringify(selectedNetwork.get('graph'))],
                          {type: "text/json;charset=utf-8"});
    FileSaver.saveAs(blob, `${selectedNetwork.get('name')}.json`, true);
  }

  loadNetwork(network, callback) {

    const networkLoader = network.get('options').loader;

    try {
      this.currentLoader = new LOADERS[networkLoader.name](
        network,
        this.ui.muiTheme,
        networkLoader.options
      );
      this.currentLoader.run(callback);
    } catch (e) {
      network.set('status', 'Error with network loader');
    }

  }

  initNetwork(_network, callback) {

    const network = observable.map({
      url: _network.url,
      name: _network.name || _network.url.split('/').pop(),
      timestamp: moment(),
      selected: true,
      options: _network.options,
      status: 'initializing...',
    });

    if (typeof(_network.url) != 'undefined' &&
        typeof(this.networks.find(n => n.get('url') == network.get('url'))) != 'undefined')
    {
      return false;
    }

    this.networks.push(network);
    this.loadNetwork(network, callback);

    return null;
  }

  selectNetwork(network_index) {
    this.clearSelectedNetwork();

    const network = this.networks[network_index];

    this.ui.filters.nodeSize = 0;
    this.ui.filters.edgeWeight = 0;
    this.ui.filters.categories = [];

    this.ui = Object.assign({}, this.ui, network.get('options').ui);

    if (network.has('source_graph')) {
      const graph = network.get('source_graph');

      const nodeSizes = graph.nodes.map(node => node.size);
      graph.minNodeSize = Math.ceil(Math.min.apply(Array, nodeSizes));
      graph.maxNodeSize = Math.ceil(Math.max.apply(Array, nodeSizes));
      graph.nodeSizeStep = (graph.maxNodeSize - graph.minNodeSize) / 100.0;

      const edgeWeights = graph.edges.map(edge => edge.weight);

      const minEdgeWeight = Math.min.apply(Array, edgeWeights);
      graph.minEdgeWeight = minEdgeWeight != Infinity ? minEdgeWeight : 0;

      const maxEdgeWeight = Math.max.apply(Array, edgeWeights);
      graph.maxEdgeWeight = maxEdgeWeight != -Infinity ? maxEdgeWeight : 0;

      graph.edgeWeightStep = (graph.maxEdgeWeight - graph.minEdgeWeight) / 100.0;

      network.set('source_graph', graph);
      this.graph.refresh = Math.random();
    }

    network.set('selected', true);
    this.selectedNetworkIndex = this.networks.map(network => network.get('selected')).indexOf(true);

    // FIXME
    // const networkLayout = this.networks[this.selectedNetworkIndex].layout || 'forcelink';
    // console.log(networkLayout);
    // console.log(mobx.toJS( this.layout[networkLayout]));
    // this.layout.params = this.layout[networkLayout];

    this.unselectGraphNode();
    this.filterGraphNode(false);
  }

  /*
  * Graph
  */

  filterGraphNode(isFiltered, filterMode) {
    this.graph.isFiltered = isFiltered;

    if(isFiltered) {
      this.graph.filterMode = filterMode || 'singlenode';
    } else {
      const graph = this.networks[this.selectedNetworkIndex].get('graph');
      if(graph) {
        graph.nodes.forEach( node => node.hidden = false);
        graph.edges.forEach( edge => edge.hidden = false);
      }
    }
    this.filterGraph();
  }

  subnetworkIds(node_id, level) {

    const selectedGraph = this.networks[this.selectedNetworkIndex].get('source_graph');

    this.tmp_subnetwork.push(node_id);

    if(level < this.graph.subnetworkLevels) {

      const neighborNodeIds = selectedGraph.edges
        .filter(edge => edge.source == node_id || edge.target == node_id)
        .map(edge => edge.source == node_id ? edge.target : edge.source);

      neighborNodeIds.forEach( nodeId => {
        if(this.tmp_subnetwork.indexOf(nodeId) == -1) {
          this.subnetworkIds(nodeId, level + 1);
        }
      });

      this.subnetwork_level += 1;

    }
  }

  selectGraphNode(node_id) {

    const selectedGraph = this.networks[this.selectedNetworkIndex].get('graph');

    let selectedNode = selectedGraph.nodes.find(node => node.id == node_id)

    const neighborNodeIds = selectedGraph.edges
      .filter(edge => edge.source == node_id || edge.target == node_id)
      .map(edge => edge.source == node_id ? edge.target : edge.source);

    const neighborNodes = selectedGraph.nodes.filter(node => neighborNodeIds.indexOf(node.id) != -1);

    //this.tmp_subnetwork = [];
    //this.subnetworkIds(node_id, 0);

    this.graph.selectedNodes.push({
      node: selectedNode,
      neighborNodes: neighborNodes,
      subNetwork: this.tmp_subnetwork
    });

    //this.tmp_subnetwork = [];
    //this.colorSelectionNode();

    //this.graph.refresh = Math.random();
  }

  unselectGraphNode() {
    this.graph.selectedNodes.clear();
    //this.colorSelectionNode();
  }

  colorSelectionNode() {

    const selectedGraph = this.networks[this.selectedNetworkIndex].get('graph');
    selectedGraph.nodes.forEach(node => node.label = null);

    if(selectedGraph.nodes.length <= 10 ||
    (this.graph.selectedNodes.length > 0 && this.ui.filters.categories.length == 3)) {
      selectedGraph.nodes.forEach( node => {
        if(node.color == node.original_color && node.metadata && node.metadata.label) {
          node.label = node.metadata.label || node.label;
        }
      });
    }

    if(this.graph.selectedNodes.length > 0) {

      let subnetworkNodeIds = [];
      this.graph.selectedNodes.forEach(selection => {
        subnetworkNodeIds = subnetworkNodeIds.concat(
          selection.subNetwork.map(nodeId => nodeId)
        );
      });

      selectedGraph.nodes.forEach( node => {
        node.color = node.original_color
        node.color = color(node.color.toString()).lighten(40)

        if(subnetworkNodeIds.indexOf(node.id) > -1) {
          node.color = node.original_color;
          if(node.metadata && node.metadata.label) {
            node.label = node.metadata.label;
          }
        }

      });

      selectedGraph.edges.forEach( edge => {
        if (edge.color != undefined) {
        edge.color = edge.original_color
        edge.color = color(edge.color.toString()).lighten(40)
        }
      });

      selectedGraph.edges.forEach( edge => {
        if(subnetworkNodeIds.indexOf(edge.source) > -1 ||
        subnetworkNodeIds.indexOf(edge.target) > -1) {
          edge.color = edge.original_color;
        }
      })

    } else {
      selectedGraph.nodes.forEach( node => {
        node.color = node.original_color;
        if(this.ui.filters.categories.length == 3) {
          if(node.metadata && node.metadata.label) {
            node.label = node.metadata.label;
          }
        } else {
          //node.label = null;
        }
      });
      selectedGraph.edges.forEach( edge => edge.color = edge.original_color );
    }



    selectedGraph.nodes.forEach( node => {
      if(node.color == node.original_color && node.metadata && node.metadata.label) {
        node.label = node.metadata.label;
      }
    });
  }

  saveSelection() {

    let network = toJS(this.networks[0]);

    network.name = this.graph.selectedNodes
      .map(selection => '#' + selection.node.metadata.number)
      .join(' - ');

    network.options.ui = {
      componentOptions: {
        selectedNodes: {disable: true},
        selectedNode: {},
      }
    };

    network.options.loader.options.blocks = this.graph.selectedNodes
      .map(selection => selection.node.metadata.number);

    this.currentLoader.stop();

    this.initNetwork(network, () => {
      this.selectNetwork(this.networks.length - 1);
      this.refreshNetwork = Math.random();
    });

  }

  removeNodeFromSelection(node_id) {
    const selectionIndex = this.graph.selectedNodes
      .map(selection => selection.node.id)
      .indexOf(node_id);

    if(selectionIndex > -1) {
      this.graph.selectedNodes.splice(selectionIndex, 1);
    }

    //this.colorSelectionNode();
    this.startLayout();
  }

  removeSubnetworkFromGraph(node_id) {

    const selection = this.graph.selectedNodes.find(selection => {
      return selection.node.id == node_id;
    });

    selection.subNetwork.forEach(node_id => this.removeNodeFromGraph(node_id));

  }

  removeNodeFromGraph(node_id) {

    this.removeNodeFromSelection(node_id);

    let selectedNetwork = this.networks[this.selectedNetworkIndex];
    const graph = toJS(selectedNetwork.get('graph'));
    const nodes = graph.nodes;
    const edges = graph.edges;

    graph.nodes = nodes.filter(node => node.id != node_id);

    graph.edges = edges.filter(edge => {
      return edge.target != node_id && edge.source != node_id;
    });

    selectedNetwork.set('graph', graph);
  }

  reorganizeSelection() {
    this.ui.filters.nodes = [];
    this.graph.selectedNodes.forEach(selection => {
      this.ui.filters.nodes = this.ui.filters.nodes.concat(
        selection.subNetwork.map(nodeId => nodeId)
      );
    });

    this.filterGraph();
  }

  filterReset() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];
    let graph = selectedNetwork.get('source_graph');
    selectedNetwork.set('graph', graph);
    this.graph.refresh = Math.random();
  }

  filterGraph() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];

    let source_graph = selectedNetwork.get('source_graph');
    let current_graph_nodes = selectedNetwork.get('graph').nodes;

    // start from source_graph, but keep current graph x/y positions
    let graph = toJS(source_graph);
    graph.nodes.forEach(node => {
      const current_node = current_graph_nodes.find(n => n.id == node.id);
      if(current_node) {
        node.x = current_node.x;
        node.y = current_node.y;
      }
    });

    graph.nodes.forEach( node => {
      node.hidden = false;
      //node.label = null;
    });
    graph.edges.forEach( edge => edge.hidden = false);

    //if(this.graph.filterMode == 'singlenode') {
    if(this.ui.filters.onlyShowSelected) {

      const selectedNodes = this.graph.selectedNodes;

      if(selectedNodes.length > 0) {

        const selectedNode = selectedNodes[selectedNodes.length - 1].node;
        const adjacentNodes = graph.edges.filter(edge => {
          return edge.target == selectedNode.id || edge.source == selectedNode.id;
        }).map( edge => {
          return edge.target == selectedNode.id ? edge.source : edge.target;
        });

        graph.nodes.forEach( node => {

          const currentNode = node.id == selectedNode.id;

          node.hidden = !currentNode && !adjacentNodes.includes(node.id);

        });

      }
    }

      //if( this.ui.filters.minNodeSize != -1 ) {
      //  graph.nodes = graph.nodes.filter( node => {
      //    if(node.size <= this.ui.filters.minNodeSize ||
      //       node.size >= this.ui.filters.maxNodeSize ||
      //       (
      //        node.metadata &&
      //        node.metadata.category &&
      //        this.ui.filters.categories.includes(node.metadata.category)
      //       )
      //      ) {
      //      graph.edges = graph.edges.filter( edge => {
      //        return edge.source != node.id && edge.target != node.id
      //      });
      //      return false;
      //    } else {
      //      return true;
      //    }
      //  });
      //}

    if( this.ui.filters.minNodeSize > 0 ) {
      graph.nodes.filter(n => !n.hidden).forEach( node => {
        node.hidden = node.size < this.ui.filters.minNodeSize;

        if(node.hidden) {
          graph.edges.filter( e => {
            !e.hidden && (e.source == node.id || e.target == node.id)
          }).forEach( e => e.hidden = true );
        }
      });
    }

    if( this.ui.filters.maxNodeSize < Infinity ) {
      graph.nodes.filter(n => !n.hidden).forEach( node => {
        node.hidden = node.size > this.ui.filters.maxNodeSize;

        if(node.hidden) {
          graph.edges.filter( e => {
            !e.hidden && (e.source == node.id || e.target == node.id)
          }).forEach( e => e.hidden = true );
        }
      });
    }

    if( this.ui.filters.minEdgeWeight > 0 ) {
      graph.edges.filter(e => !e.hidden).forEach( edge => {
        edge.hidden = edge.weight < this.ui.filters.minEdgeWeight;
      });
    }

    if( this.ui.filters.maxEdgeWeight < Infinity ) {
      graph.edges.filter(e => !e.hidden).forEach( edge => {
        edge.hidden = edge.weight > this.ui.filters.maxEdgeWeight;
      });
    }

    if(this.ui.filters.topics.length > 0) {
      graph.nodes.forEach(node => {

        let theta = node.metadata.theta;
        this.ui.filters.topics.forEach(index => theta[index] = undefined);

        let indexOfMaxTheta = theta.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

        node.color = selectedNetwork.get('topics')[indexOfMaxTheta].color;
        node.size = theta[indexOfMaxTheta] * 100;

      });
    }

    graph.nodes.forEach( node => {
      if(
        node.metadata && node.metadata.category &&
        this.ui.filters.categories.includes(node.metadata.category)
      ) {
        node.hidden = true;

        graph.edges.filter( e => {
          !e.hidden && (e.source == node.id || e.target == node.id)
        }).forEach( e => e.hidden = node.hidden );

      }
    });

    if(this.ui.filters.hideOrphans) {

      // Get unique node ids that are connected to an edge
      const edgyNodes = [...new Set([].concat.apply([], graph.edges
                                                    .filter( e => !e.hidden)
                                                    .map( edge => {
        return [edge.source, edge.target];
      })))];

      // Filter visible nodes, and hidden them if not connected to an edge
      graph.nodes.filter(node => !node.hidden).forEach( node => {
        if(!edgyNodes.includes(node.id)) {
          node.hidden = true;

          graph.edges.filter( e => {
            !e.hidden && (e.source == node.id || e.target == node.id)
          }).forEach( e => e.hidden = true );
        }
      });
    }

    if(this.ui.filters.attributes && this.ui.filters.attributes.length > 0) {
      graph.nodes.forEach( node => {
        let selected = true;

        this.ui.filters.attributes.forEach(attr => {
          if(selected) {
            selected = node[attr.key] && attr.values.indexOf(node[attr.key]) != -1;
          }
        });

        if(selected) {
          this.ui.filters.nodes.push(node.id);
        }
      });
    }

    if(this.ui.filters.nodes && this.ui.filters.nodes.length > 0) {

      graph.nodes = graph.nodes.filter(node => {
        return this.ui.filters.nodes.indexOf(node.id) > -1;
      });

      graph.edges = graph.edges.filter(edge => {
        return  this.ui.filters.nodes.indexOf(edge.source) > -1 &&
                this.ui.filters.nodes.indexOf(edge.target) > -1
      });

      this.ui.filters.nodes = [];
    }

    graph.nodes.forEach( node => {
      if(this.ui.filters.categories.length == 3 &&
        !toJS(selectedNetwork.get('graph')).selectedNodes) {
        if(node.metadata && node.metadata.label) {
          node.label = node.metadata.label;
        }
      }
    });

    // hidden nodes and edges are not compatible with force atlas layout
    // they need to be removed
    graph.nodes = graph.nodes.filter(n => !n.hidden);
    const existingNodes = graph.nodes.map(n => n.id);
    graph.edges = graph.edges.filter(e => {
      return !e.hidden &&
        existingNodes.includes(e.source) &&
        existingNodes.includes(e.target);
    });
    graph.refresh = Math.random();

    selectedNetwork.set('graph', graph);
    //this.colorSelectionNode();
  }

  toggleGraphFilter() {
    this.graph.isFiltered = !this.graph.isFiltered;
  }

  toggleTopicFilter(index) {
    if(this.ui.filters.topics.includes(index)) {
      this.ui.filters.topics.remove(index);
    } else {
      this.ui.filters.topics.push(index);
    }
    this.filterGraph();
  }

  setFilter(filters, value) {
    Object.keys(filters).forEach( key => {
      this.ui.filters[key] = filters[key];
    });
    this.graph.isFiltered = true;
    //this.colorSelectionNode();
    this.filterGraph();
  }

  setFilterAttribute(key, values) {
    let filterModified = false;

    this.ui.filters.attributes.forEach(attr => {
      if(attr.key === key) {
        attr.values = values;
        filterModified = true;
      }
    });

    if(!filterModified) {
      this.ui.filters.attributes.push({key: key, values: values});
    }

    if(key == 'acategory') {
      this.contribution_patient = values;
    }

    this.graph.isFiltered = true;
    this.filterGraph();
  }

  filterOnStep(step) {
    let selectedNetwork = this.networks[this.selectedNetworkIndex];
    const graph = toJS(selectedNetwork.get('source_graph'));
    const nodes = graph.nodes;
    const edges = graph.edges;
    const steps = graph.steps;

    const hiddenNodes = step == steps.length ? [] : steps.slice(step);

    graph.nodes = nodes.filter(node => !hiddenNodes.includes(node.id));

    graph.edges = edges.filter(edge => {
      if(hiddenNodes.includes(edge.target) || hiddenNodes.includes(edge.source)) {
        return false;
      } else {
        return true;
      }
    });

    selectedNetwork.set('graph', graph);
  }

  /*
  * UI
  */

  toggleLeftDrawer() {
    let drawer = this.ui.drawers.find(drawer => drawer.id == 'left');
    drawer.open = !drawer.open;
  }

  toggleRightDrawer() {
    let drawer = this.ui.drawers.find(drawer => drawer.id == 'right');
    drawer.open = !drawer.open;
  }

  showRightDrawer() {
    this.ui.drawers.find(drawer => drawer.id == 'right').open = true;
  }

  hideRightDrawer() {
    this.ui.drawers.find(drawer => drawer.id == 'right').open = false;
  }

  showFullscreen() {
    this.ui.mode = 'fullscreen';
  }

  showCard() {
    this.ui.mode = 'card';
  }

  /*
  * Layout
  */

  startLayout = () => {
    this.layout.shouldStart = true;
    this.layout.shouldStop = false;
    this.layout.running = true;
  }

  stopLayout = () => {
    this.layout.shouldStart = false;
    this.layout.shouldStop = true;
    this.layout.running = false;
  }

  layoutRunning = () => {
    this.layout.shouldStart = false;
    this.layout.shouldStop = false;
    this.layout.running = true;
  }

  layoutStopped = (nodes) => {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];
    const graph = selectedNetwork.get('graph');
    graph.nodes = nodes;
    selectedNetwork.set('graph', graph);
    this.layout.shouldStart = false;
    this.layout.shouldStop = false;
    this.layout.running = false;
  }

  updateLayout = (params) => {
    this.layout.params = params;
  }

  /*
  * Meta Solicitation
  */
  @observable contribution_strategy = '';
  @observable contribution_patient = '';
  @observable contribution_mobilization_author = '';
  @observable contribution_mobilization_patient = '';

  createMeta = () => {
    this.contribution_mobilization_author = this.graph.selectedNodes.map(selection => {
      return selection.node.metadata.label;
    }).join(' / ');
  }

}

export default AppState;
