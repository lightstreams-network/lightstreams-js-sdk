/* eslint-disable import/no-extraneous-dependencies */
/*
  issue with react-hot-loader
  eventhough those 2 dependencies are only used in development
  eslint has no way to tell that and outputs an error
*/

// react dependencies
import React from 'react';
import ReactDOM from 'react-dom';
// hot reload for development
import { AppContainer } from 'react-hot-loader';

import App from './App';

import './style.scss';

const root = document.getElementById('root');

// AWFUL HACK caused of a unknown issue with Webpack-dotenv
window.process = {
  'env': {
    WEB3_PROVIDER: 'http://localhost:8645'
    // WEB3_PROVIDER: 'ws://localhost:8546'
  }
};

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root,
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => { render(App); });
}
