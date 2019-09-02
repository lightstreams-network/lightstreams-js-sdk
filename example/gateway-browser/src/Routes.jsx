import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Account, Uploader, ENS, Wallet } from './pages';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/uploader" component={Uploader} />
    <Route path="/account" component={Account} />
    <Route path="/ens" component={ENS} />
    <Route path="/wallet" component={Wallet} />
  </Switch>
);

export default Routes;
