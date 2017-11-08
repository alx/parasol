import {
  green500,
  deepOrange500,
  deepPurple500,
  pink500,
  amber500,
  cyan500,
  brown500,
  grey500,
  grey50,
  blueGrey100,
  blueGrey500,
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

const topicColors = {
  scheme1: [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
    "#ffed6f",
  ],
  scheme2: [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
    "#ffff99",
    "#b15928",
  ]
};

export default class LdaJson {

  network = null;
  options = null;
  colorScheme = topicColors.scheme2;

  constructor(network, muiTheme, options) {
    this.network = network;
    this.muiTheme = muiTheme;
    this.options = options;
  }

  run(callback) {

    const network = this.network;
    let categories = [];

    fetch(network.get('url')).then(response => response.json()).then((json) => {

      if (json.topics) {
        network.set('topics', json.topics.map( (topic, index) => {
          return {terms: topic, color: this.colorScheme[index]};
        }));
      }

      if (json.nodes) {

        json.nodes.forEach(node => {

          if(!node.x)
            node.x = Math.random();

          if(!node.y)
            node.y = Math.random();

          if(!node.size)
            node.size = 1;

          if(node.metadata && node.metadata.theta) {
            const theta = node.metadata.theta
            const indexOfMaxTheta = theta.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            node.color = this.colorScheme[indexOfMaxTheta];
          }
        });

      }

      if (json.edges) {
        json.edges.forEach(edge => {
          edge.color = COLORS.edge[this.muiTheme];
        });

        if(this.options.minEdgeWeight) {
          json.edges = json.edges.filter(edge => {
            return edge.weight > this.options.minEdgeWeight
          });
        }
      }

      network.set('graph', json);
      network.set('source_graph', json);
      network.set('colors', COLORS);
      network.set('categories', categories.map((category, index) => {
        return {name: category, color: COLORS.nodes[index]};
      }));

      if(typeof(callback) != 'undefined')
        callback(network);

    });

  }

}
