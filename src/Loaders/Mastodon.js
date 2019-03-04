import moment from "moment";
import Masto from "mastodon-api";

import {
  amber500,
  amber300,
  cyan800,
  cyan500,
  cyan300,
  cyan100,
  deepPurple500,
  red500,
  blue500,
  yellow500
} from "material-ui/styles/colors";

const COLORS = {
  nodes: {
    toot: yellow500,
    deleted_toot: red500,
    account: blue500
  },
  edge: {
    has_toot: yellow500,
    reply_toot: yellow500,
    reply_account: yellow500
  }
};

export default class Mastodon {
  network = null;
  options = null;
  M = null;

  graph = {
    nodes: [],
    edges: [],
    refresh: Math.random()
  };

  run(callback) {
    this._initGraph();

    this.network.set("categories", [
      { name: "toot", color: cyan500 },
      { name: "account", color: cyan500 }
    ]);
    this.M.get(`timelines/public`).then(resp => {
      resp.data.forEach(toot => this.onToot(toot));
    });

    const listener = this.M.stream("streaming/public");
    listener.on("message", msg => this.onToot(msg));

    if (typeof callback != "undefined") callback(this.network);
  }

  onToot(toot) {
    console.log(toot);
    const data = toot.data;

    let source = {};

    switch (toot.event) {
      case "update":
        source = {
          id: data.id,
          category: "toot",
          size: 1,
          metadata: data
          //weight: toot.account.followers
        };
        break;
      case "delete":
        source = {
          id: data,
          category: "deleted_toot",
          weight: 1
          //weight: toot.account.followers
        };
        break;
      default:
        console.log("===");
        console.warn(" uncatched event");
        console.log(toot);
    }

    let targets = [];

    if (data && data.account && data.account.id) {
      targets.push({
        id: data.account.id,
        category: "account",
        type: "has_toot",
        weight: 1
      });
    }

    if (data && data.in_reply_to_id) {
      targets.push({
        id: data.in_reply_to_id,
        category: "toot",
        type: "reply_toot",
        weight: 1
      });
    }

    if (data && data.in_reply_to_account_id) {
      targets.push({
        id: toot.in_reply_to_account_id,
        category: "account",
        type: "reply_account",
        weight: 1
      });
    }

    this._createNode(
      source.id,
      { category: source.category, number: source.id },
      1
    );

    targets.forEach((target, index) => {
      this._createNode(target.id, { category: target.category });
      this._createEdge({
        source: source.id,
        target: target.id,
        type: target.type
      });
    });

    this._refreshGraph();
  }

  stop() {}

  constructor(network, muiTheme, options) {
    this.network = network;
    this.options = options;

    this.M = new Masto({
      timeout_ms: 60 * 1000,
      access_token: this.options.access_token,
      api_url: this.options.api_url
    });
  }

  _initGraph() {
    this.network.set("source_graph", this.graph);
    this.network.set("graph", this.graph);
  }

  _refreshGraph() {
    const current_nodes = this.network.get("graph").nodes;
    this.graph.nodes.forEach(node => {
      const current_node = current_nodes.find(n => n.id == node.id);
      if (current_node) {
        node.x = current_node.x;
        node.y = current_node.y;
      }
    });

    if (
      this.options.nodeLimit &&
      this.graph.nodes.length > this.options.nodeLimit
    ) {
      this.graph.nodes = this.graph.nodes
        .sort((a, b) => b.size - a.size)
        .slice(0, this.options.nodeLimit);
      this.graph.edges = this.graph.edges.filter(e => {
        return (
          this.graph.nodes.includes(e.source) &&
          this.graph.nodes.includes(e.target)
        );
      });
    }

    if (this.graph.nodes.length > 0) {
      const nodeSizes = this.graph.nodes.map(node => node.size);
      this.graph.minNodeSize = Math.ceil(Math.min.apply(Array, nodeSizes));
      this.graph.maxNodeSize = Math.ceil(Math.max.apply(Array, nodeSizes));
      this.graph.nodeSizeStep =
        (this.graph.maxNodeSize - this.graph.minNodeSize) / 100.0;
    }

    if (this.graph.edges.length > 0) {
      const edgeWeights = this.graph.edges.map(edge => edge.weight);
      const minEdgeWeight = Math.min.apply(Array, edgeWeights);
      this.graph.minEdgeWeight = minEdgeWeight != Infinity ? minEdgeWeight : 0;
      const maxEdgeWeight = Math.max.apply(Array, edgeWeights);
      this.graph.maxEdgeWeight = maxEdgeWeight != -Infinity ? maxEdgeWeight : 0;
      this.graph.edgeWeightStep =
        (this.graph.maxEdgeWeight - this.graph.minEdgeWeight) / 100.0;
    }

    this.network.set("source_graph", this.graph);
    this.network.set("graph", this.graph);
    this.graph.refresh = Math.random();
  }

  _createNode(node_id, metadata, increment = 1) {
    if (!node_id || node_id.length == 0) return null;

    let node = this.graph.nodes.find(n => n.id == node_id);
    if (node) {
      node.size += increment;
    } else {
      this.graph.nodes.push({
        id: node_id,
        size: increment,
        x: Math.random(),
        y: Math.random(),
        color: COLORS.nodes[metadata.category],
        metadata: metadata
      });
    }
  }

  _createEdge(content) {
    if (
      this.graph.nodes.find(n => n.id == content.source) &&
      this.graph.nodes.find(n => n.id == content.target)
    ) {
      this.graph.edges.push(
        Object.assign({}, { id: `e${this.graph.edges.length + 1}` }, content)
      );
    }
  }
}
