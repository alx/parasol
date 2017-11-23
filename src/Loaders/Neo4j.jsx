var neo4j = require('neo4j');

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
  nodes: [
    cyan500,
    grey500,
    amber500,
    deepOrange500,
    pink500,
    deepPurple500,
    green500,
    brown500,
  ],
  edge: {
    dark: blueGrey800,
    light: blueGrey100,
  },
};

export default class Neo4j {

  network = null;
  options = null;

  constructor(network, muiTheme, options) {
    this.network = network;
    this.muiTheme = muiTheme;
    this.options = options;
  }

  run(callback) {

    const network = this.network;
    let categories = [];

    var db = new neo4j.GraphDatabase(this.options.db);

    if(typeof(callback) != 'undefined')
      callback(network);
  }

}
