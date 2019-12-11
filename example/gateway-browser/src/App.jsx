import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import { Home, Account, Uploader, ENS, Wallet, Storage } from './pages';

const RouteURLs = {
  home: "/",
  uploader: "/uploader",
  account: "/account",
  ens: "/ens",
  wallet: "/wallet",
  storage: "/storage",
};

const App = () => (
  <BrowserRouter>
    <main className="container">
      <ul className="left">
        <li>
          <Link to={RouteURLs.home}>Home</Link>
        </li>
        <li>
          <Link to={RouteURLs.uploader}>Uploader</Link>
        </li>
        <li>
          <Link to={RouteURLs.account}>Account</Link>
        </li>
        <li>
          <Link to={RouteURLs.ens}>ENS</Link>
        </li>
        <li>
          <Link to={RouteURLs.wallet}>Wallet</Link>
        </li>
        <li>
          <Link to={RouteURLs.storage}>Storage</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={RouteURLs.home} component={Home} />
        <Route path={RouteURLs.uploader} component={Uploader} />
        <Route path={RouteURLs.account} component={Account} />
        <Route path={RouteURLs.ens} component={ENS} />
        <Route path={RouteURLs.wallet} component={Wallet} />
        <Route path={RouteURLs.storage} component={Storage} />
      </Switch>
    </main>
  </BrowserRouter>
);

export default App;
