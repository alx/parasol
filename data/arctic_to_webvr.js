const fs = require('fs');
var arctic = require('./arctic.json');

arctic.nodes.forEach(function(node) {
  node.z = Math.random();
});

fs.writeFile('webvr.json', JSON.stringify(arctic, null, 4));
