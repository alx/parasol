import { computed, observable } from 'mobx';
import moment from 'moment';

import LoaderTsne from './Loaders/Tsne';
import LoaderJson from './Loaders/Json';

const LOADERS = {
  dd_tsne: LoaderTsne,
  json: LoaderJson,
};

class AppState {

  @observable networks = [];
  @observable selectedNetworkIndex = 0;

  @observable graph = {
    selectedNode: null,
    isFiltered: false,
    filterMode: 'singlenode',
    neighborNodes: []
  };

  @observable ui = {
    leftDrawer: true,
    rightDrawer: true,
    renderer: 'webgl',
    filters: {
      nodeSize: 0,
      edgeSize: 0,
      maxNodeSize: 1,
      maxEdgeSize: 1,
    },
    muiTheme: 'dark',
  };

  @observable layout = {
    running: false,
    shouldStart: false,
    shouldStop: false,
    params: {
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

    if (settings.networks) {
      settings.networks.forEach((network, index) => {
        if (index == (settings.networks.length - 1)) {
          // select first imported network when done
          this.initNetwork(network, () => { this.selectNetwork(0); });
        } else {
          this.initNetwork(network, () => {});
        }
      });
    }

    if (settings.ui) {
      this.ui = Object.assign(this.ui, settings.ui);
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
    return this.networks.find(network => network.get('selected'));
  }

  clearSelectedNetwork() {
    this.networks.filter(network => network.get('selected'))
                 .forEach(network => {
                   network.set('selected', false);
                 });
  }

  loadNetwork(network, callback) {

    const networkLoader = network.get('options').loader;

    try {
      const loader = new LOADERS[networkLoader.name](network);
      loader.run(callback);
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

    if (typeof(this.networks.find(n => n.get('url') == network.get('url'))) != 'undefined') {
      return false;
    }

    this.networks.push(network);
    this.loadNetwork(network, callback);

    return null;

  }

  selectNetwork(network_index) {

    if(this.selectedNetworkIndex == network_index)
      return null;

    this.clearSelectedNetwork();

    const network = this.networks[network_index];
    network.set('selected', true);

    this.ui.filters.nodeSize = 0;
    this.ui.filters.edgeSize = 0;
    this.ui.filters.maxNodeSize = 1;
    this.ui.filters.maxEdgeSize = 1;

    if (network.has('graph')) {
      const graph = network.get('graph');
      this.ui.filters.maxNodeSize = Math.max.apply(Array, graph.nodes.map(node => node.size));
      this.ui.filters.maxEdgeSize = Math.max.apply(Array, graph.edges.map(edge => edge.size));
    }

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
      graph.nodes.forEach( node => node.hidden = false);
      graph.edges.forEach( edge => edge.hidden = false);
    }
  }

  selectGraphNode(node_id) {

    const selectedGraph = this.networks[this.selectedNetworkIndex].get('graph');

    this.graph.selectedNode = selectedGraph.nodes.find(node => node.id == node_id);

    const neighborNodeIds = selectedGraph.edges
      .filter(edge => edge.source == node_id || edge.target == node_id)
      .map(edge => edge.source == node_id ? edge.target : edge.source);

    this.graph.neighborNodes = selectedGraph.nodes.filter(node => neighborNodeIds.indexOf(node.id) != -1);
  }

  unselectGraphNode() {
    this.graph.selectedNode = null;
    this.graph.neighborNodes = [];
  }

  toggleGraphFilter() {
    this.graph.isFiltered = !this.graph.isFiltered;
  }

  /*
  * UI
  */

  toggleLeftDrawer() {
    this.ui.leftDrawer = !this.ui.leftDrawer;
  }

  toggleRightDrawer() {
    this.ui.rightDrawer = !this.ui.rightDrawer;
  }

  showRightDrawer() {
    this.ui.rightDrawer = true;
  }

  hideRightDrawer() {
    this.ui.rightDrawer = false;
  }

  setFilter(filter, value) {
    this.ui.filters[filter] = value;
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

  layoutStopped = () => {
    this.layout.shouldStart = false;
    this.layout.shouldStop = false;
    this.layout.running = false;
  }

  updateLayout = (params) => {
    this.layout.params = params;
  }
}

export default AppState;
