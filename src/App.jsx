import React, { Component } from 'react';
import { observer } from 'mobx-react';

import SigmaComponent from './SigmaComponent';
import Drawer from './Components/Drawer';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

@observer
export default class App extends Component {

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
          {appState.ui.drawers.map( (drawer, index) => {
            return <Drawer key={'drawer' + index} drawer={drawer} appState={appState}/>;
          })}
        </div>
      </MuiThemeProvider>
    );
  }
}
