class JsonFeed {

  network = null;

  constructor(network, muiTheme) {
    this.network = network;
    this.muiTheme = muiTheme;
  }

  run(callback) {

    const network = this.network;
    let graph = {nodes: [], edges: []};
    let existing_tags = [];

    let edge_index = 0;
    let node_index = 0;
    let tag_index = 0;

    fetch(network.get('url')).then(response => response.json()).then((json) => {

      if (json.items) {

        json.items.forEach(item => {
          graph.nodes.push({
            id: 'n' + node_index,
            x: Math.random(),
            y: Math.random(),
            size: item.tags.length,
            label: 'node',
            color: '#00F',
            original_color: '#00F',
          });
          const source_node_index = node_index;
          node_index += 1;

          item.tags.filter(tag => tag != 'submitted').forEach( tag => {

            let tag_index = -1;

            if(existing_tags.indexOf(tag) === -1) {
              existing_tags.push(tag);
              graph.nodes.push({
                id: 'n' + node_index,
                x: Math.random(),
                y: Math.random(),
                label: tag,
                color: '#0F0',
                original_color: '#0F0',
                size: 1,
              });
              tag_index = node_index;
              node_index += 1;
            } else {
              tag_index = existing_tags.findIndex( n => n === tag);
            }

            graph.edges.push({
              id: 'e' + edge_index,
              source: 'n' + source_node_index,
              target: 'n' + tag_index
            });
            edge_index += 1;

          });
        });

      network.set('graph', graph);
      network.set('source_graph', graph);
      network.set('colors', '#F00');

      if(typeof(callback) != 'undefined')
        callback(network);

      }

    });

  }

}

export default JsonFeed;
