import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Controls from './Controls';
import InfoBox from './InfoBox';
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
          <Controls appState={this.props.appState}/>
          <SigmaComponent appState={this.props.appState}/>
          <InfoBox appState={this.props.appState}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
