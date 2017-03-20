import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SigmaComponent from './SigmaComponent';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

@observer
class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <SigmaComponent/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
