import React, { Component } from 'react';
import { observer } from 'mobx-react';

import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';
import SigmaComponent from './SigmaComponent';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

@observer
class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
          <LeftDrawer appState={this.props.appState}/>
          <SigmaComponent appState={this.props.appState}/>
          <RightDrawer appState={this.props.appState}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
