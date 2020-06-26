import React, { Component } from "react";
import { observer } from "mobx-react";

import Avatar from "material-ui/Avatar";
import { List, ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";

import NodeItem from "./SelectedNode/NodeItem";

@observer
export default class NodeList extends Component {
  render() {
    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    if (!network || !network.has("source_graph")) return null;

    const graph = network.get("source_graph");

    let componentOptions = null;
    if (appState.ui.componentOptions && appState.ui.componentOptions.nodes) {
      componentOptions = appState.ui.componentOptions.nodes;

      if (componentOptions.disable) return null;
    }

    return (
      <div key={`nodelist-${appState.graph.refresh}`}>
        <Subheader>Node List</Subheader>
        <List>
          {graph.nodes
            .sort((a, b) => a.metadata.timestamp - b.metadata.timestamp)
            .map((node, index) => {
              return (
                <ListItem
                  key={`selectednode-${node.id}-${index}`}
                  primaryText={node.metadata.category}
                  secondaryText={node.id}
                />
              );
            })}
        </List>
      </div>
    );
  }
}
