// https://rebecca-ricks.com/paypal-data/data/paypal.json
var fs = require('fs');



Convert = function () {
  this.paypal = require('./paypal.json');
  this.graph = {nodes: [], edges:[]}

  this.colors = {
    root: '#e41a1c',
    child: '#377eb8',
    company:'#4daf4a',
    data: '#984ea3',
    country: '#ff7f00',
  };


}
Convert.prototype._addDataNodes = function (data) {
  var nodeIds = [];

  data.split(',').forEach( child => {
    let node = this.graph.nodes.find(n => n.label === child.toLowerCase());

    if(node == null) {
      node = {
        id: this.graph.nodes.length,
        label: child.toLowerCase(),
        size: 1,
        metadata: {
          category: 'Data',
        }
      }
      this.graph.nodes.push(node);
    } else {
      node.size += 1;
    }

    nodeIds.push(node.id);
  })
  return nodeIds;
}
Convert.prototype._addCountryNodes = function (country) {
  var nodeIds = [];

  let node = this.graph.nodes.find(n => n.label === country);

  if(node == null) {
    node = {
      id: this.graph.nodes.length,
      label: country,
      size: 1,
      metadata: {
        category: 'Country',
      }
    }
    this.graph.nodes.push(node);
  } else {
    node.size += 1;
  }

  nodeIds.push(node.id);

  return nodeIds;
}
Convert.prototype._addCompaniesNodes = function (childrenName) {
  var nodeIds = [];

  childrenName.split(',').forEach( child => {
    let node = this.graph.nodes.find(n => n.label === child);

    if(node == null) {
      node = {
        id: this.graph.nodes.length,
        label: child,
        size: 1,
        metadata: {
          category: 'Company',
        }
      }
      this.graph.nodes.push(node);

      var regExp = /\(([^)]+)\)/g;
      var matches = child.match(regExp);
      if(matches && matches[0].length > 0) {
        var nodes = this._addCountryNodes(matches[0]);
        this._addEdges(node, nodes);
      }

    } else {
      node.size += 1;
    }

    nodeIds.push(node.id);
  })
  return nodeIds;
}
Convert.prototype._addChildrenNodes = function (children) {
  var nodeIds = [];

  children.forEach( child => {
    let node = this.graph.nodes.find(n => n.label === child.Purpose);
    if(node == null) {
      node = {
        id: this.graph.nodes.length,
        label: child.Purpose,
        size: child.Data.split(',').length,
        metadata: {
          category: 'Purpose',
        },
      }
      this.graph.nodes.push(node);
    } else {
      node.size += 1;
    }
    nodeIds.push(node.id);

    const companies = this._addCompaniesNodes(child.name)
    this._addEdges(node, companies);
    const datas = this._addDataNodes(child.Data)
    this._addEdges(node, datas);

    companies.forEach( companyId => {
      const companyNode = this.graph.nodes.find(n => n.id === companyId);
      this._addEdges(companyNode, datas);
    });

  })

  return nodeIds;
}

Convert.prototype._addEdges = function (source, targets) {
  targets.forEach( targetId => {
    var existingEdge = this.graph.edges.find(e => {
      return (e.source == source.id && e.target == targetId) ||
        (e.target == source.id && e.source == targetId)
    })

    if(!existingEdge) {
      this.graph.edges.push({
        id: this.graph.edges.length,
        source: source.id,
        target: targetId
      });
    }
  });
}

Convert.prototype._addRootNodes = function (
  jsonContent
) {
  let node = {
    id: this.graph.nodes.length,
    label: jsonContent.name,
    size: jsonContent.children.length,
    metadata: {
      category: 'root',
    }
  };
  //this.graph.nodes.push(node);

  const children = this._addChildrenNodes(jsonContent.children)
  //this._addEdges(node, children);

}
Convert.prototype.get = function () {
  this.paypal[0].children.forEach( c => this._addRootNodes(c))
  return this.graph
}

var myConvert = new Convert();
var data = myConvert.get();

fs.writeFile("convert.json", JSON.stringify(data, null, 2), (err) => {
  if(err)
    console.log(err);
});
