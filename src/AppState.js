import { computed, observable } from 'mobx';
import moment from 'moment';
import { DeepDetect } from 'deepdetect-js';

import {
  cyan500,
  deepOrange500,
  deepPurple500,
  pink500,
  green500,
  amber500,
  brown500,
  grey500,
  grey50,
  blueGrey100,
  blueGrey800,
} from 'material-ui/styles/colors';

class AppState {

  @observable networks = [];
  @observable selectedNetworkIndex = 0;

  @observable graph = {
    selectedNode: null,
    isFiltered: false,
    neighborNodes: []
  };

  @observable ui = {
    leftDrawer: true,
    rightDrawer: false,
    renderer: 'webgl',
    filters: {
      nodeSize: 0,
      edgeSize: 0,
      maxNodeSize: 1,
      maxEdgeSize: 1,
    },
    muiTheme: 'dark',
    colors: {
      nodes: [
        cyan500,
        deepOrange500,
        deepPurple500,
        pink500,
        green500,
        amber500,
        brown500,
        grey500,
      ],
      selectedNode: grey50,
      edge: blueGrey100,
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

    if (settings.networks) {
      settings.networks.forEach(network => {
        this.initNetwork(network, () => { this.selectNetwork(0); });
      });
    }

    if (settings.ui) {
      this.ui = Object.assign(this.ui, settings.ui);

      if (this.ui.muiTheme == 'dark' &&
         (typeof(settings.ui.colors) == 'undefined' ||
         typeof(settings.ui.colors.edge) == 'undefined')) {
        this.ui.colors.edge = blueGrey800;
      }
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
    return this.networks.find(network => network.selected);
  }

  clearSelectedNetwork() {
    this.networks.filter(network => network.selected)
                 .forEach(network => {
                   network.selected = false;
                 });
  }

  loadNetwork(network) {

    this.networks.push({
      url: network.url,
      name: network.name || network.url.split('/').pop(),
      timestamp: moment(),
      selected: true,
      graph: null,
      options: network.options,
    });

  }

  loadJsonNetwork(network, callback) {

    fetch(network.url).then(response => response.json()).then((json) => {

      if (json.nodes) {

        const categories = json.nodes.map(node => node.category)
          .filter((category, index, self) => self.indexOf(category) === index)
          .filter(category => typeof(category) != 'undefined' && category.length > 0);

        json.nodes.forEach(node => {
          if (node.category) {
            node.color = this.ui.colors.nodes[categories.indexOf(node.category)];
          } else {
            node.color = this.ui.colors.nodes[this.ui.colors.nodes.length - 1];
          }
        });

      }

      if (json.edges) {

        json.edges.forEach(edge => {
          edge.color = this.ui.colors.edge;
        });

      }

      this.networks.find(n => n.url == network.url).graph = json;

      callback(this.networks[this.networks.length - 1]);

    });

  }

  loadTsneNetwork(_network, callback) {

    const network = this.networks.find(n => n.url == _network.url);
    network.options.layout = 'none';

    const deepdetect = new DeepDetect('/api');

    const service_name = 'parasoltest';

    const service_params = {
      mllib:"tsne",
      description:"clustering",
      type:"unsupervised",
      parameters:{
        input:{connector:"csv"},
        mllib:{},
        output:{}
      },
      model:{
        repository:"/tmp"
      }
    };

    const train_params = {
      service: service_name,
      'async':false,
      parameters:{
        input:{
          id:"",
          separator:",",
          label:"label"
        },
        mllib:{
          iterations:500
        },
        output:{}
      },
      data:[network.url]
    };

    network.status = 'loading...';

    console.log('deepdetect');
    deepdetect.services.create(service_name, service_params).then(function (response) {

    network.status = 'training...';

      deepdetect.train.launch(train_params).then(function (response) {

        network.status = 'complete';

        deepdetect.services.delete(service_name);

        network.graph = {
          nodes: response.body.predictions.map( prediction => {
            return {
              id: prediction.uri,
              x: prediction.vals[0],
              y: prediction.vals[1],
              color: '#9e9e9e',
            };
          }),
          edges: []
        };

      });
    });

    /*
    fetch(network.url).then(response => response.json()).then((json) => {

      if (json.nodes) {

        const categories = json.nodes.map(node => node.category)
          .filter((category, index, self) => self.indexOf(category) === index)
          .filter(category => typeof(category) != 'undefined' && category.length > 0);

        json.nodes.forEach(node => {
          if (node.category) {
            node.color = this.ui.colors.nodes[categories.indexOf(node.category)];
          } else {
            node.color = this.ui.colors.nodes[this.ui.colors.nodes.length - 1];
          }
        });

      }

      if (json.edges) {

        json.edges.forEach(edge => {
          edge.color = this.ui.colors.edge;
        });

      }

      this.networks.find(n => n.url == network.url).graph = json;

      callback(this.networks[this.networks.length - 1]);

    });
    */

  }

  loadNetwork(network, callback) {

    switch(network.loader) {
      case 'dd_tsne':
        this.loadTsneNetwork(network, callback)
        break;
      case 'graph_json':
      default:
        this.loadJsonNetwork(network, callback)
    }

  }

  refreshSelectedNetwork() {
    this.loadNetwork(this.networks[this.selectedNetworkIndex], () => {});
  }

  initNetwork(network, callback) {

    if(typeof(this.networks.find(n => n.url == network.url)) != 'undefined')
      return false;

    this.networks.push({
      url: network.url,
      name: network.name || network.url.split('/').pop(),
      timestamp: moment(),
      selected: true,
      graph: null,
      options: network.options,
      status: 'initializing...',
    });

    this.loadNetwork(network, callback);

  }

  selectNetwork(network_index) {
    this.clearSelectedNetwork();

    const network = this.networks[network_index];
    network.selected = true;

    this.ui.filters.nodeSize = 0;
    this.ui.filters.edgeSize = 0;
    this.ui.filters.maxNodeSize = 1;
    this.ui.filters.maxEdgeSize = 1;

    if (network.graph && typeof(network.graph) !== 'undefined') {
      this.ui.filters.maxNodeSize = Math.max.apply(Array, network.graph.nodes.map(node => node.size));
      this.ui.filters.maxEdgeSize = Math.max.apply(Array, network.graph.edges.map(edge => edge.size));
    }

    this.selectedNetworkIndex = this.networks.map(network => network.selected).indexOf(true);

    // FIXME
    // const networkLayout = this.networks[this.selectedNetworkIndex].layout || 'forcelink';
    // console.log(networkLayout);
    // console.log(mobx.toJS( this.layout[networkLayout]));
    // this.layout.params = this.layout[networkLayout];
  }

  /*
  * Graph
  */

  selectGraphNode(node_id) {

    const selectedGraph = this.networks[this.selectedNetworkIndex].graph;

    this.graph.selectedNode = selectedGraph.nodes.find(node => node.id == node_id);

    const neighborNodeIds = selectedGraph.edges
      .filter(edge => edge.source == node_id || edge.target == node_id)
      .map(edge => edge.source == node_id ? edge.target : edge.source);

    this.graph.neighborNodes = selectedGraph.nodes.filter(node => neighborNodeIds.indexOf(node.id) != -1);

    this.ui.rightDrawer = true;
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
