import React, { Component } from 'react';
import { observer } from 'mobx-react';

import SigmaComponent from './SigmaComponent';

import AppBar from './Components/AppBar';

import ForceLinkSettings from './Components/Settings/ForceLinkSettings';

import Legend from './Components/Filters/Legend';
import SearchInput from './Components/Filters/SearchInput';
import FilterSize from './Components/Filters/Size';

import NetworkInput from './Components/Networks/Input';
import NetworkList from './Components/Networks/List';
import SelectedNode from './Components/Networks/SelectedNode';
import NeighborNodes from './Components/Networks/NeighborNodes';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

@observer
class App extends Component {

  componentWillMount(){
    document.body.style.margin = 0;
  }

  componentWillUnmount(){
    document.body.style.margin = null;
  }

  renderDrawer(side) {

    const appState = this.props.appState;
    const drawer = appState.ui.drawers[side];

    return (<Drawer
      key={`drawer-${side}`}
      open={drawer.open}
      openSecondary={drawer.openSecondary}
    >
      {drawer.components.map( component => {
        switch(component.name) {
          case 'AppBar':
            return <AppBar appState={appState} />;
          case 'NetworkInput':
            return <NetworkInput appState={appState} />;
          case 'NetworkList':
            return <NetworkList appState={appState} />;
          case 'Divider':
            return <Divider/>;
          case 'ForceLinkSettings':
            return <ForceLinkSettings appState={appState} />;
          case 'Legend':
            return <Legend appState={appState} />;
          case 'SearchInput':
            return <SearchInput appState={appState} />;
          case 'FilterSize':
            return <FilterSize appState={appState} />;
          case 'SelectedNode':
            return <SelectedNode appState={appState} />;
          case 'SelectedNodes':
            return <SelectedNode appState={appState} />;
          case 'NeighborNodes':
            return <NeighborNodes appState={appState} />;
          default:
            break;
        }
      })}
    </Drawer>);
  }

  render() {

    const appState = this.props.appState;

    let muiTheme = lightBaseTheme;
    if(appState.ui.muiTheme) {

      switch(appState.ui.muiTheme) {
        case 'light':
          muiTheme = lightBaseTheme;
          break;
        case 'dark':
          muiTheme = darkBaseTheme;
          break;
      }

    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        <div>
          <SigmaComponent appState={appState}/>
          {this.renderDrawer('left')}
          {this.renderDrawer('right')}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
