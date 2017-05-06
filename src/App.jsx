import React, { Component } from 'react';
import { observer } from 'mobx-react';

import AframeComponent from './AframeComponent';
import SigmaComponent from './SigmaComponent';
import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';

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

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;

    if(!network || !network.has('graph'))
      return null


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

    let mainComponent;
    switch(network.loader) {
      case 'json3d':
        mainComponent = (<AframeComponent appState={appState}/>);
        break;
      case 'json':
      default:
        mainComponent = (<AframeComponent appState={appState}/>);
      //mainComponent = (<SigmaComponent appState={appState}/>);
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        <div>
          {mainComponent}
          <LeftDrawer appState={appState}/>
          <RightDrawer appState={appState}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
