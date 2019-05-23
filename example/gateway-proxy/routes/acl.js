/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const _ = require('lodash');

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { JsonResponse, ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const grant = async (req, res, next) => {
    const query = ['acl', 'owner', 'password', 'to', 'permission'];
    try {
      validateRequestAttrs(req, query);
    } catch (err) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { is_granted } = await gwApi.acl.grant(attrs.acl, attrs.owner, attrs.password, attrs.to, attrs.permission);
      res.send(JsonResponse({ is_granted }));
    } catch ( err ) {
      next(err);
    }
  };

  const revoke = async (req, res, next) => {
    const query = ['acl', 'owner', 'password', 'to'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { is_revoked } = await gwApi.acl.revoke(attrs.acl, attrs.owner, attrs.password, attrs.to);
      res.send(JsonResponse({ is_revoked }));
    } catch ( err ) {
      next(err);
    }
  };

  const grantPublic = async (req, res, next) => {
    const query = ['acl', 'owner', 'password'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { is_granted } = await gwApi.acl.grantPublic(attrs.acl, attrs.owner, attrs.password);
      res.send(JsonResponse({ is_granted }));
    } catch ( err ) {
      next(err);
    }
  };

  const revokePublic = async (req, res, next) => {
    const query = ['acl', 'owner', 'password'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const { is_revoked } = await gwApi.acl.revokePublic(attrs.acl, attrs.owner, attrs.password);
      res.send(JsonResponse({ is_revoked }));
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'grant',
      call: grant,
      method: 'post'
    },
    {
      path: 'revoke',
      call: revoke,
      method: 'post'
    },
    {
      path: 'grant-public',
      call: grantPublic,
      method: 'post'
    },
    {
      path: 'revoke-public',
      call: revokePublic,
      method: 'post'
    }
  ];
};
