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

class Json {

  network = null;

  constructor(network, muiTheme) {
    this.network = network;
    this.muiTheme = muiTheme;
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

          if(node.metadata && !node.metadata.forceColor) {
            if (node.metadata.category) {
              node.color = COLORS.nodes[categories.indexOf(node.metadata.category)];
            } else {
              node.color = COLORS.nodes[COLORS.nodes.length - 1];
            }
          }
        });

      }

      if (json.edges) {
        json.edges.forEach(edge => {
          edge.color = COLORS.edge[this.muiTheme];
        });
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
