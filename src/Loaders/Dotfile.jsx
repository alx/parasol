import {
  amber500,
  grey500,
} from 'material-ui/styles/colors';

import parse from 'dotparser';

export default class Dotfile {

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

    fetch(network.get('url')).then(response => response.text()).then((dotfile) => {

      const ast = parse(dotfile);

      let graph = {
        nodes: [],
        edges: [],
      }


      if(ast.length > 0 && ast[0].children.length > 0) {

        graph.nodes = ast[0].children.filter(n => n.type == "node_stmt")
                                  .map(n => {
                                    return {
                                      id: n.node_id.id,
                                      x: Math.random(),
                                      y: Math.random(),
                                      size: 1,
                                      color: amber500
                                    };
                                  });

        graph.edges = ast[0].children.filter(e => e.type == "edge_stmt")
                                  .map((e, index) => {
                                    return {
                                      id: `e${index}`,
                                      source: e.edge_list[0].id,
                                      target: e.edge_list[1].id
                                    };
                                  });
      }

      network.set('graph', graph);
      network.set('source_graph', graph);

      if(typeof(callback) != 'undefined')
        callback(network);

    });

  }

}
