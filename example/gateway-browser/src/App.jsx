import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

import Routes from './Routes';

const App = () => (
  <BrowserRouter>
    <main className="container">
      <ul className="left">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/uploader">Uploader</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
      <Routes />
    </main>
  </BrowserRouter>
);

export default App;
