const fs = require('fs');

const letters = {
  p: {
    nodes: [
      {id: 'p-0', x: 0, y: 0, size: 1},
      {id: 'p-1', x: 0, y: -1, size: 1},
      {id: 'p-2', x: 0, y: -2, size: 1},
      {id: 'p-3', x: 1, y: -1, size: 1},
      {id: 'p-4', x: 1, y: -2, size: 1}
    ],
    edges: [
      {id: 'p-e-0', source: 'p-0', target: 'p-1'},
      {id: 'p-e-1', source: 'p-1', target: 'p-2'},
      {id: 'p-e-2', source: 'p-1', target: 'p-3'},
      {id: 'p-e-3', source: 'p-4', target: 'p-2'},
      {id: 'p-e-4', source: 'p-4', target: 'p-3'}
    ]
  },
  a: {
    nodes: [
      {id: 'a-0', x: 0, y: 0, size: 1},
      {id: 'a-1', x: 0.25, y: -1, size: 1},
      {id: 'a-2', x: 0.5, y: -2, size: 1},
      {id: 'a-3', x: 0.75, y: -1, size: 1},
      {id: 'a-4', x: 1, y: 0, size: 1}
    ],
    edges: [
      {id: 'a-e-0', source: 'a-0', target: 'a-1'},
      {id: 'a-e-1', source: 'a-1', target: 'a-2'},
      {id: 'a-e-2', source: 'a-1', target: 'a-3'},
      {id: 'a-e-3', source: 'a-2', target: 'a-3'},
      {id: 'a-e-4', source: 'a-3', target: 'a-4'}
    ]
  },
  r: {
    nodes: [
      {id: 'r-0', x: 0, y: 0, size: 1},
      {id: 'r-1', x: 0, y: -1, size: 1},
      {id: 'r-2', x: 0, y: -2, size: 1},
      {id: 'r-3', x: 1, y: -2, size: 1},
      {id: 'r-4', x: 1, y: -1, size: 1},
      {id: 'r-5', x: 1, y: 0, size: 1}
    ],
    edges: [
      {id: 'r-e-0', source: 'r-1', target: 'r-0'},
      {id: 'r-e-1', source: 'r-1', target: 'r-2'},
      {id: 'r-e-2', source: 'r-1', target: 'r-4'},
      {id: 'r-e-3', source: 'r-1', target: 'r-5'},
      {id: 'r-e-4', source: 'r-3', target: 'r-2'},
      {id: 'r-e-5', source: 'r-3', target: 'r-4'}
    ]
  },
  s: {
    nodes: [
      {id: 's-0', x: 0, y: 0, size: 1},
      {id: 's-1', x: 1, y: 0, size: 1},
      {id: 's-2', x: 1, y: -1, size: 1},
      {id: 's-3', x: 0, y: -1, size: 1},
      {id: 's-4', x: 0, y: -2, size: 1},
      {id: 's-5', x: 1, y: -2, size: 1}
    ],
    edges: [
      {id: 's-e-0', source: 's-0', target: 's-1'},
      {id: 's-e-1', source: 's-1', target: 's-2'},
      {id: 's-e-2', source: 's-2', target: 's-3'},
      {id: 's-e-3', source: 's-3', target: 's-4'},
      {id: 's-e-4', source: 's-4', target: 's-5'}
    ]
  },
  o: {
    nodes: [
      {id: 'o-0', x: 0, y: 0, size: 1},
      {id: 'o-1', x: 0, y: -2, size: 1},
      {id: 'o-2', x: 1, y: -2, size: 1},
      {id: 'o-3', x: 1, y: 0, size: 1}
    ],
    edges: [
      {id: 'o-e-0', source: 'o-0', target: 'o-1'},
      {id: 'o-e-1', source: 'o-1', target: 'o-2'},
      {id: 'o-e-2', source: 'o-2', target: 'o-3'},
      {id: 'o-e-3', source: 'o-3', target: 'o-0'}
    ]
  },
  l: {
    nodes: [
      {id: 'l-0', x: 0, y: -2, size: 1},
      {id: 'l-1', x: 0, y: 0, size: 1},
      {id: 'l-2', x: 1, y: 0, size: 1}
    ],
    edges: [
      {id: 'l-e-0', source: 'l-0', target: 'l-1'},
      {id: 'l-e-1', source: 'l-1', target: 'l-2'}
    ]
  }
};

let final_graph = {nodes: [], edges: []}

'parasol'.split('').forEach( (_letter, index) => {
  const letter = JSON.parse(JSON.stringify(letters[_letter]));
  final_graph.nodes = final_graph.nodes.concat(letter.nodes.map( node => {
    return Object.assign(node, {id: index + node.id, x: (index * 2) + node.x});
  }));
  final_graph.edges = final_graph.edges.concat(letters[_letter].edges.map( edge => {
    return {id: index + edge.id, source: index + edge.source, target: index + edge.target};
  }));
});
console.log(final_graph);
fs.writeFile('parasol.json', JSON.stringify(final_graph, null, 4));
