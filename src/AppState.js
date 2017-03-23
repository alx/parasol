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
  };

  constructor() {
  }

  initSettings(settings) {

    if(settings.networks) {
      settings.networks.forEach( network => {
        this.createNetwork(network, () => { this.selectNetwork(0); });
      });
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

  createNetwork(network_url, callback) {

    this.clearSelectedNetwork();

    this.networks.push({
      url: network_url,
      name: network_url.split('/').pop(),
      timestamp: moment(),
      selected: true,
      graph: null
    });

    fetch(network_url).then( (response) => {

      return response.json()

    }).then( (json) => {

      this.networks.find( network => network.url == network_url).graph = json;

      callback(this.networks[this.networks.length - 1]);

    });

  }

  selectNetwork(network_index) {
    this.clearSelectedNetwork();
    this.networks[network_index].selected = true;
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
}

export default AppState;
