import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppState from './AppState';
import App from './App';

const appState = new AppState();

const elements = [];

const initParasol = (settingsUrl, element) => {

  fetch(settingsUrl).then( response => {
    return response.json();
  }).then( json => {

    appState.initSettings(json);

    render(
      <AppContainer>
        <App appState={appState} />
      </AppContainer>,
      element
    );

    if (module.hot) {
      module.hot.accept('./App', () => {
        const NextApp = require('./App').default;

        render(
          <AppContainer>
            <NextApp appState={appState} />
          </AppContainer>,
          element
        );
      });
    }

  });

}

if(document.getElementById('root')) {
  initParasol('settings.json', document.getElementById('root'));
} else {
  const elements = document.getElementsByClassName('parasol');
  [].forEach.call(elements, element => {
    let settingsUrl = 'settings.json';
    if(element.dataset.settings) {
      settingsUrl = element.dataset.settings
    }
    initParasol(settingsUrl, element);
  });
}

