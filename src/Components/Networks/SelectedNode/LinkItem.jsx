import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';

import OpenIcon from 'material-ui/svg-icons/action/open-in-new';

Object.resolve = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || self)
}
export default class LinkItem extends Component {
  render() {

    const node = this.props.node;
    const option = this.props.option;

    let linkItem = null;
    let url = null;

    if(option.hrefKey) {
      const href = Object.resolve(option.hrefKey, node);
      url = option.hrefPrefix + href;
    } else if(option.url) {
      url = option.url;
    }

    switch(option.linkType) {
      case 'image':
        linkItem = <ListItem
          key={option.key ? option.key : 'linkItem'}
        >
          <img
            src={url}
            style={{maxWidth: '100%', minWidth: '100%', width: '100%'}}
          />
        </ListItem>;
        break;
      case 'url':
      default:
        linkItem = <ListItem
          key={option.key ? option.key : 'linkItem'}
          primaryText={option.primaryText ? option.primaryText : url}
          secondaryText={option.secondaryText ? option.secondaryText : 'Open link in new tab'}
          rightIcon={<OpenIcon />}
          onClick={() => {
            const win = window.open(url, '_blank');
            win.focus();
          }}
        />;
    }

    return linkItem;
  }
}
