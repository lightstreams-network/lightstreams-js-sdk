/**
 * User: ggarrido
 * Date: 4/02/19 15:24
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');
const { Gateway } = require('lightstreams-js-sdk');

module.exports = (gwDomain) => {

  const gateway = Gateway(gwDomain);

  return _.concat(
    _.map(require('./user')(gateway), (route) => ({...route, path: `/user/${route.path}` })),
    _.map(require('./wallet')(gateway), (route) => ({...route, path: `/wallet/${route.path}` })),
    _.map(require('./storage')(gateway), (route) => ({...route, path: `/storage/${route.path}` })),
    _.map(require('./acl')(gateway), (route) => ({...route, path: `/acl/${route.path}` })),
    _.map(require('./shop')(gateway), (route) => ({...route, path: `/shop/${route.path}` })),
    _.map(require('./erc20')(gateway), (route) => ({...route, path: `/erc20/${route.path}` })),
  );
};
