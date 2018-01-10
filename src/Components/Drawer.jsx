import React, { Component } from 'react';
import { observer } from 'mobx-react';

import AppBar from './AppBar';

import ForceLinkSettings from './Settings/ForceLinkSettings';

import Legend from './Filters/Legend';
import SearchInput from './Filters/SearchInput';
import NodeSize from './Filters/NodeSize';
import EdgeWeight from './Filters/EdgeWeight';
import HideOrphan from './Filters/HideOrphan';
import ShowSelected from './Filters/ShowSelected';
import TopicSelector from './Filters/TopicSelector';

import NetworkInput from './Networks/Input';
import NetworkList from './Networks/List';
import SelectedNode from './Networks/SelectedNode';
import SelectedNodes from './Networks/SelectedNodes';
import NeighborNodes from './Networks/NeighborNodes';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

@observer
export default class ParasolDrawer extends Component {

  render() {

    const drawer = this.props.drawer;
    const appState = this.props.appState;

    return (<Drawer
      key={drawer.id}
      open={drawer.open}
      openSecondary={drawer.openSecondary}
      className={`drawer-${drawer.id}`}
    >
      {drawer.components.map( (component, index) => {
        switch(component.name) {
          case 'AppBar':
            return <AppBar key={drawer.id + index} appState={appState} />;
          case 'NetworkInput':
            return <NetworkInput key={drawer.id + index} appState={appState} />;
          case 'NetworkList':
            return <NetworkList key={drawer.id + index} appState={appState} />;
          case 'Divider':
            return <Divider key={drawer.id + index}/>;
          case 'ForceLinkSettings':
            return <ForceLinkSettings key={drawer.id + index} appState={appState} />;
          case 'Legend':
            return <Legend key={drawer.id + index} appState={appState} />;
          case 'TopicSelector':
            return <TopicSelector key={drawer.id + index} appState={appState} />;
          case 'SearchInput':
            return <SearchInput key={drawer.id + index} appState={appState} />;
          case 'EdgeWeight':
            return <EdgeWeight key={drawer.id + index} appState={appState} />;
          case 'NodeSize':
            return <NodeSize key={drawer.id + index} appState={appState} />;
          case 'HideOrphan':
            return <HideOrphan key={drawer.id + index} appState={appState} />;
          case 'ShowSelected':
            return <ShowSelected key={drawer.id + index} appState={appState} />;
          case 'SelectedNode':
            return <SelectedNode key={drawer.id + index} appState={appState} />;
          case 'SelectedNodes':
            return <SelectedNodes key={drawer.id + index} appState={appState} />;
          case 'NeighborNodes':
            return <NeighborNodes key={drawer.id + index} appState={appState} />;
          default:
            break;
        }
      })}
    </Drawer>);
  }
}
