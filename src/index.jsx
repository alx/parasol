import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppState from './AppState';

import Fullscreen from './DisplayMode/Fullscreen';
import Card from './DisplayMode/Card';

const initParasolCard = (settingsUrl, element) => {

  fetch(settingsUrl).then( response => {
    return response.json();
  }).then( json => {

    const appState = new AppState();
    appState.initSettings(json);

    render(
      <AppContainer>
        <Card appState={appState} />
      </AppContainer>,
      element
    );

    if (module.hot) {
      module.hot.accept('./DisplayMode/Card', () => {
        const NextCard = require('./DisplayMode/Card').default;

        render(
          <AppContainer>
            <NextCard appState={appState} />
          </AppContainer>,
          element
        );
      });
    }

  });
}

const initParasolFullscreen = (settingsUrl, element) => {

  fetch(settingsUrl).then( response => {
    return response.json();
  }).then( json => {

    const appState = new AppState();
    appState.initSettings(json);

    render(
      <AppContainer>
        <Fullscreen appState={appState} />
      </AppContainer>,
      element
    );

    if (module.hot) {
      module.hot.accept('./DisplayMode/Fullscreen', () => {
        const NextFullscreen = require('./DisplayMode/Fullscreen').default;

        render(
          <AppContainer>
            <NextFullscreen appState={appState} />
          </AppContainer>,
          element
        );
      });
    }

  });

}

const elements = document.getElementsByClassName('parasol');
[].forEach.call(elements, element => {

  let settingsUrl = 'settings.json';
  if(element.dataset.settings)
    settingsUrl = element.dataset.settings;

  let display = 'fullscreen';
  if(element.dataset.display)
    display = element.dataset.display;

  switch(display) {
    case 'card':
      initParasolCard(settingsUrl, element);
      break;
    case 'fullscreen':
    default:
      initParasolFullscreen(settingsUrl, element);
      break;
  }
});

