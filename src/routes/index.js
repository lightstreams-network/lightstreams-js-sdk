/**
 * User: ggarrido
 * Date: 4/02/19 15:24
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');
const GatewayAPI = require('../gateway');

module.exports = (gwDomain) => {
  const userRoutes = require('./user')(GatewayAPI(gwDomain));
  const walletRoutes = require('./wallet')(GatewayAPI(gwDomain));
  const storageRoutes = require('./storage')(GatewayAPI(gwDomain));
  const aclRoutes = require('./acl')(GatewayAPI(gwDomain));

  return _.concat(
    _.map(userRoutes, (route) => {return {...route, path: `/user/${route.path}` }}),
    _.map(walletRoutes, (route) => {return {...route, path: `/wallet/${route.path}` }}),
    _.map(storageRoutes, (route) => {return {...route, path: `/storage/${route.path}` }}),
    _.map(aclRoutes, (route) => {return {...route, path: `/acl/${route.path}` }}),
  );
};
