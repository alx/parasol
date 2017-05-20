import { computed, observable, toJS } from 'mobx';
import moment from 'moment';

import LoaderTsne from './Loaders/Tsne';
import LoaderJson from './Loaders/Json';
import LoaderLombardi from './Loaders/Lombardi';

import FileSaver from 'file-saver';

const LOADERS = {
  dd_tsne: LoaderTsne,
  json: LoaderJson,
  lombardi: LoaderLombardi,
};

class AppState {

  @observable networks = [];
  @observable selectedNetworkIndex = 0;

  @observable graph = {
    selectedNodes: [],
    isFiltered: false,
    filterMode: 'singlenode',
    neighborNodes: [],
    maxNodeSize: 1,
    maxEdgeWeight: 1,
  };

  @observable ui = {
    leftDrawer: true,
    rightDrawer: true,
    renderer: 'canvas',
    filters: {
      minNodeSize: 0,
      maxNodeSize: 1,
      minEdgeWeight: 0,
      maxEdgeWeight: 1,
      hideOrphans: true,
      categories: [],
    },
    muiTheme: 'dark',
    labels: {
      //labelThreshold: 1.5,
      labelSize: 'ratio',
      labelSizeRatio: 2,
      fontStyle: '500',
      font: 'Roboto',
      labelColor: 'node',
    }
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

    if (settings.ui) {
      this.ui = Object.assign(this.ui, settings.ui);
    }

    if (settings.networks) {
      const self = this;
      settings.networks.forEach((network, index) => {
        if (index == (settings.networks.length - 1)) {
          // select first imported network when done
          this.initNetwork(network, () => {
            self.selectNetwork(0);
          });
        } else {
          this.initNetwork(network, () => {});
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
    this.loadNetwork(selectedNetwork);
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
    FileSaver.saveAs(blob, `${selectedNetwork.get('name')}.json`);
  }

  loadNetwork(network, callback) {

    const networkLoader = network.get('options').loader;

    try {
      const loader = new LOADERS[networkLoader.name](network, this.ui.muiTheme);
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

    this.clearSelectedNetwork();

    const network = this.networks[network_index];

    this.ui.filters.nodeSize = 0;
    this.ui.filters.edgeWeight = 0;
    this.ui.filters.categories = [];

    if (network.has('graph')) {
      const graph = network.get('graph');
      this.graph.maxNodeSize = Math.ceil(Math.max.apply(Array, graph.nodes.map(node => node.size)));
      this.graph.maxEdgeWeight = Math.ceil(Math.max.apply(Array, graph.edges.map(edge => edge.weight)));
    }

    this.ui.filters.maxNodeSize = this.graph.maxNodeSize;
    this.ui.filters.maxEdgeWeight = this.graph.maxEdgeWeight;

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
      graph.nodes.forEach( node => node.hidden = false);
      graph.edges.forEach( edge => edge.hidden = false);
    }
  }

  selectGraphNode(node_id) {

    const selectedGraph = this.networks[this.selectedNetworkIndex].get('graph');

    this.graph.selectedNodes.push(selectedGraph.nodes.find(node => node.id == node_id));

    const neighborNodeIds = selectedGraph.edges
      .filter(edge => edge.source == node_id || edge.target == node_id)
      .map(edge => edge.source == node_id ? edge.target : edge.source);

    this.graph.neighborNodes = selectedGraph.nodes.filter(node => neighborNodeIds.indexOf(node.id) != -1);
  }

  unselectGraphNode() {
    this.graph.selectedNodes.clear();
    this.graph.neighborNodes = [];
  }

  filterReset() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];
    let graph = network.get('source_graph');
    network.set('graph', graph);
  }

  filterGraph() {
    const selectedNetwork = this.networks[this.selectedNetworkIndex];

    let graph = toJS(selectedNetwork.get('source_graph'))

    graph.nodes = graph.nodes.filter( node => {
      if(node.size <= this.ui.filters.minNodeSize ||
         node.size >= this.ui.filters.maxNodeSize ||
         (
          node.metadata &&
          node.metadata.category &&
          this.ui.filters.categories.includes(node.metadata.category)
         )
        ) {
        graph.edges = graph.edges.filter( edge => {
          return edge.source != node.id && edge.target != node.id
        });
        return false;
      } else {
        return true;
      }
    });

    graph.edges = graph.edges.filter( edge => {
      return edge.weight >= this.ui.filters.minEdgeWeight &&
             edge.weight <= this.ui.filters.maxEdgeWeight;
    });

    if(this.ui.filters.hideOrphans) {
      const edgyNodes = [].concat.apply([], graph.edges.map( edge => {
        return [edge.source, edge.target];
      }));
      graph.nodes = graph.nodes.filter( node => edgyNodes.indexOf(node.id) != -1 );
    }

    selectedNetwork.set('graph', graph);
  }

  toggleGraphFilter() {
    this.graph.isFiltered = !this.graph.isFiltered;
  }

  setFilter(filters, value) {
    Object.keys(filters).forEach( key => {
      this.ui.filters[key] = filters[key];
    });
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
