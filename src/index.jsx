import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import AppState from './AppState';

const initParasol = (element, settings) => {

  const appState = new AppState();
  appState.initSettings(settings);

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

}

const elements = document.getElementsByClassName('parasol');
[].forEach.call(elements, element => {

  let settings = {url: 'settings.json'};

  if(element.dataset.settings)
    settings = JSON.parse(element.dataset.settings);

  if(element.dataset.settingsUrl)
    settings.url = element.dataset.settingsUrl;

  if(settings.url) {
    fetch(settings.url).then( response => {
      return response.json();
    }).then( json => {
      initParasol(element, json);
    });
  } else {
    initParasol(element, settings);
  }

});

