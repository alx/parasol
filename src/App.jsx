import React, { Component } from 'react';
import { observer } from 'mobx-react';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Fullscreen from './DisplayMode/Fullscreen';
import Card from './DisplayMode/Card';
import VRScene from './DisplayMode/VR/VRScene';

@observer
export default class App extends Component {

  render() {

    const appState = this.props.appState;

    let muiTheme = lightBaseTheme;

    if(appState.ui.muiTheme && appState.ui.muiTheme == 'dark')
      muiTheme = darkBaseTheme;

    let elements = null;
    switch(appState.ui.mode) {
      case 'card':
        elements = <Card appState={appState}/>
        break;
      case 'webvr':
        return <VRScene appState={appState}/>
      case 'fullscreen':
      default:
        elements = <Fullscreen appState={appState}/>;
        break;
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        {elements}
      </MuiThemeProvider>
    );
  }
}
