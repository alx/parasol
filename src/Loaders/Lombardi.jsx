import {
  green500,
  deepOrange500,
  deepPurple500,
  pink500,
  amber500,
  cyan500,
  grey500,
  blueGrey100,
  blueGrey800,
} from 'material-ui/styles/colors';

const COLORS = {
  types: {
    'FinalInfo': cyan500,
    'Institution': grey500,
    'MergedInstitution': amber500,
    'Node': deepOrange500,
    'Person': pink500,
    'Year': deepPurple500,
    'YearFinal': green500,
  },
  edge: {
    dark: blueGrey800,
    light: blueGrey100,
  },
};

class Lombardi {

  network = null;

  constructor(network, muiTheme) {
    this.network = network;
    this.muiTheme = muiTheme;
  }

  run(callback) {

    const network = this.network;
    let categories = [];

    fetch(network.get('url')).then(response => response.json()).then((json) => {

      if(json.nodes[0].type) {

        json.nodes.forEach(node => {

          const type = node.type.split('#').pop();

          if(!categories.includes(type)) {
            categories.push(type)
          }

          node.x = node.x || Math.random();
          node.y = node.y || Math.random();
          node.size = 1;

          node.metadata = {category: type};
          node.color = COLORS.types[type];

          if(type == 'Year') {
            node.mass = 1;
            //node.x = parseInt(node.name.split('/').shift()) + parseInt(node.name.split('/').pop()) * 0.1;
            //node.y = 1;
          } else {
            node.mass = 100;
          }

          delete node.type;
        });

        json.edges = json.links;
        delete json.links;

        json.edges.forEach((edge, index) => {
          edge.id = index;
          edge.color = COLORS.edge[this.muiTheme];
          delete edge.type;
        });

      }

      network.set('graph', json);
      network.set('source_graph', json);
      network.set('colors', COLORS);
      network.set('categories', categories.map((category, index) => {
        return {name: category, color: COLORS.types[category]};
      }));

      if(typeof(callback) != 'undefined')
        callback(network);

    });

  }

}

export default Lombardi;
