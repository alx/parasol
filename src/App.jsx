import React, { Component } from 'react';
import { observer } from 'mobx-react';

import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';
import SigmaComponent from './SigmaComponent';

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
          <LeftDrawer appState={appState}/>
          <RightDrawer appState={appState}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
