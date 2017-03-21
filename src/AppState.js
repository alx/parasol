import { computed, observable } from 'mobx';
import moment from 'moment';

class AppState {
  @observable networkIndex = 0;
  @observable networkUrls = [];

  constructor() {
  }

  @computed get selectedNetwork() {
    return this.networkUrls[this.networkIndex];
  }

  createNetwork(network_url) {
    this.networkUrls.push({
      url: network_url,
      name: network_url.split('/').pop(),
      timestamp: moment()
    });
    this.networkIndex = this.networkUrls.length - 1;
  }

  selectNetwork(network_index) {
    this.networkIndex = network_index;
  }
}

export default AppState;
