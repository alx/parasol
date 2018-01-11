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

class Json {

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

    fetch(network.get('url')).then(response => response.json()).then((json) => {

      if (json.nodes) {

        categories = json.nodes.map(node => node.metadata ? node.metadata.category : null)
          .filter((category, index, self) => self.indexOf(category) === index)
          .filter(category => typeof(category) != 'undefined' && category && category.length > 0);

        json.nodes.forEach(node => {

          if(!node.x)
            node.x = Math.random();

          if(!node.y)
            node.y = Math.random();

          if(!node.size)
            node.size = 1;

          if(!node.metadata)
            node.metadata = {label: ''};

          if(node.label)
            node.metadata.label = node.label;

          if(!node.color || node.metadata.forceColor) {
            if (node.metadata.category) {
              node.color = COLORS.nodes[categories.indexOf(node.metadata.category)];
            } else {
              node.color = COLORS.nodes[COLORS.nodes.length - 1];
            }
          } else if(node.color && node.metadata.category) {
            COLORS.nodes[categories.indexOf(node.metadata.category)] = node.color;
          }
        });

      }

      if (json.edges) {

        json.edges.forEach(edge => {
          if(!edge.color) {
            edge.color = COLORS.edge[this.muiTheme];
          }
        });

        if(this.options && this.options.minEdgeWeight) {
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

export default Json;
