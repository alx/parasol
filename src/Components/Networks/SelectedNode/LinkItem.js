import React, { Component } from "react";
import { ListItem } from "material-ui/List";

import OpenIcon from "material-ui/svg-icons/action/open-in-new";

Object.resolve = function(path, obj) {
  return path.split(".").reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj || self);
};
export default class LinkItem extends Component {
  render() {
    const node = this.props.node;
    const content = this.props.content;

    let linkItem = null;
    let url = null;

    if (content.hrefKey) {
      const href = Object.resolve(content.hrefKey, node);
      url = content.hrefPrefix + href;
    } else if (content.url) {
      url = content.url;
    }

    console.log(content.linkType);

    switch (content.linkType) {
      case "image":
        linkItem = (
          <ListItem key={content.key ? content.key : "linkItem"}>
            <img
              key="node-item-img"
              src={url}
              style={{ maxWidth: "100%", minWidth: "100%", width: "100%" }}
            />
          </ListItem>
        );
        break;
      case "url":
      default:
        linkItem = (
          <ListItem
            key={content.key ? content.key : "linkItem"}
            primaryText={content.primaryText ? content.primaryText : url}
            secondaryText={
              content.secondaryText
                ? content.secondaryText
                : "Open link in new tab"
            }
            rightIcon={<OpenIcon />}
            onClick={() => {
              const win = window.open(url, "_blank");
              win.focus();
            }}
          />
        );
    }

    return linkItem;
  }
}
