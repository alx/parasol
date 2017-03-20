import { observable } from 'mobx';

class AppState {
  @observable timer = 0;

  constructor() {
  }
}

export default AppState;
