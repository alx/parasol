import { computed, observable } from 'mobx';
import moment from 'moment';

class AppState {

  @observable networks = [];
  @observable selectedNetworkIndex = 0;

  @observable graph = {
    selectedNode: null,
    isFiltered: false,
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
  };

  constructor() {
  }

  initSettings(settings) {

    if(settings.networks) {
      settings.networks.forEach( network => {
        this.createNetwork(network, () => { this.selectNetwork(0); });
      });
    }

    if(settings.ui) {
      this.ui = Object.assign(this.ui, settings.ui);
    }

  }

  /*
  * Network
  */

  @computed get selectedNetwork() {
    return this.networks.find( network => network.selected );
  }

  clearSelectedNetwork() {
    this.networks.filter( network => network.selected )
                 .forEach( network => network.selected = false );
  }

  createNetwork(network, callback) {

    this.clearSelectedNetwork();

    this.networks.push({
      url: network.url,
      name: network.name || network.url.split('/').pop(),
      timestamp: moment(),
      selected: true,
      graph: null,
      options: network.options,
    });

    fetch(network.url).then( (response) => {

      return response.json()

    }).then( (json) => {

      this.networks.find( n => n.url == network.url).graph = json;

      callback(this.networks[this.networks.length - 1]);

    });

  }

  selectNetwork(network_index) {
    this.clearSelectedNetwork();

    const network = this.networks[network_index];
    network.selected = true;

    this.ui.filters.nodeSize = 0;
    this.ui.filters.edgeSize = 0;
    this.ui.filters.maxNodeSize = 1;
    this.ui.filters.maxEdgeSize = 1;

    if(network.graph && typeof(network.graph) !== 'undefined') {
      this.ui.filters.maxNodeSize = Math.max.apply(Array, network.graph.nodes.map( node => node.size ));
      this.ui.filters.maxEdgeSize = Math.max.apply(Array, network.graph.edges.map( edge => edge.size ));
    }

    this.selectedNetworkIndex = this.networks.map( network => network.selected ).indexOf(true);
  }

  /*
  * Graph
  */

  selectGraphNode(node) {
    this.ui.rightDrawer = true;
    this.graph.selectedNode = node;
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
}

export default AppState;
