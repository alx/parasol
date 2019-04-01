import { computed, observable, toJS } from "mobx";
require("babel-polyfill");
//import DD from "deepdetect-js";
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
  blueGrey800
} from "material-ui/styles/colors";

const COLORS = {
  nodes: [
    cyan500,
    grey500,
    amber500,
    deepOrange500,
    pink500,
    deepPurple500,
    green500
  ],
  edge: {
    dark: blueGrey800,
    light: blueGrey100
  }
};

export default class LoaderTextStream {
  dd = null;
  ddReady = false;
  network = null;
  options = {
    ddServerParams: {
      host: "localhost",
      port: 8095,
      path: "/dd",
      predictPostData: {
        service: "sent_en",
        parameters: {
          mllib: {
            gpu: false
          }
        }
      }
    }
  };

  constructor(network, muiTheme, options) {
    console.log(network);
    this.network = network;
    this.muiTheme = muiTheme;

    this.network.set("graph", { nodes: [], edges: [] });
    this.network.set("colors", COLORS);

    try {
      //this.loadDD();

      const urlStream = network.get("urlStream")
        ? network.get("urlStream")
        : "http://stream.pushshift.io/?type=comments&subreddit=drugs";

      const evtSource = new EventSource(urlStream);
      evtSource.addEventListener("rc", this.event.bind(this), false);
    } catch (e) {
      console.log(e);
    }
  }

  async loadDD() {
    //this.dd = new DD(this.options.ddServerParams);

    try {
      await this.dd.putService("sent_en", {
        description: "sentiment - english",
        model: {
          repository: "/opt/platform/models/public/sent_en_char/"
        },
        mllib: "caffe",
        type: "supervised",
        parameters: {
          input: {
            connector: "txt",
            characters: true,
            alphabet: "abcdefghijklmnopqrstuvwxyz0123456789,;.!?'",
            sequence: 140
          },
          mllib: {
            nclasses: 2,
            gpu: true,
            gpuid: 0
          }
        }
      });
    } catch (e) {
      // service already exists
    }

    this.ddReady = true;
  }

  async event(e) {
    if (!this.ddReady) return null;

    const data = JSON.parse(e.data);

    let graph = this.network.get("graph");
    console.log(toJS(graph));

    //
    // Nodes
    //

    let source = {
      id: graph.nodes.length,
      label: data.subreddit,
      category: "subreddit",
      size: 1
    };

    let target = {
      id: graph.nodes.length + 1,
      label: data.author,
      category: "author",
      size: 1
    };

    let existingSource = graph.nodes.find(n => {
      return n.category == source.category && n.label == source.label;
    });

    let existingTarget = graph.nodes.find(n => {
      return n.category == target.category && n.label == target.label;
    });

    let postData = this.options.ddServerParams.predictPostData;
    postData.data = [data.body.replace(/[^0-9a-z]/gi, "")];
    const predict = await this.dd.postPredict(postData);

    const mood = predict.body.predictions[0].classes[0].cat;
    const score = predict.body.predictions[0].classes[0].prob;

    let opacity = 1;
    if (mood === "negative") {
      opacity = 0.5 - score / 2;
    } else {
      opacity = 0.5 + score / 2;
    }

    if (existingSource) {
      source = existingSource;
      source.size += score;
      source.color = "rgba(255,255,255," + opacity + ")";
    } else {
      source.color = "rgba(255,255,255," + opacity + ")";
      graph.nodes = [...graph.nodes, source];
    }

    if (existingTarget) {
      target = existingTarget;
      target.size += 1;
      target.color = "rgba(255,255,255," + opacity + ")";
    } else {
      target.color = "rgba(255,255,255," + opacity + ")";
      graph.nodes = [...graph.nodes, target];
    }

    //
    // Edges
    //

    let existingEdge = graph.edges.find(e => {
      return e.source == source.id && e.target == target.id;
    });

    if (!existingEdge) {
      const newEdge = {
        id: graph.edges.length,
        source: source.id,
        target: target.id
      };
      graph.edges = [...graph.edges, newEdge];
    }

    graph.refresh = Math.random();

    this.network.set("graph", graph);
    this.network.set("source_graph", graph);
  }

  run(callback) {
    if (typeof callback != "undefined") callback(network);
  }
}
