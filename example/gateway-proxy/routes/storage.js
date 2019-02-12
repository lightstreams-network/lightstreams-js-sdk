/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { validateRequestAttrs, extractRequestAttrs } = require('../lib/request');
const { ErrorBadInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const addFile = async (req, res, next) => {
    const query = ['owner', 'password', 'file'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const reqStream = await gwApi.storage.addProxy(attrs.owner, attrs.password, attrs.file);
      reqStream
        .on('uploadProgress', progress => {
          console.log(`Uploading: ${progress.transferred} KB`);
          if (progress.percent === 1) {
            console.log("Upload completed");
          }
        })
        .pipe(res);
    } catch ( err ) {
      next(err);
    }
  };

  const fetchFile = async (req, res, next) => {
    const query = ['meta', 'token'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(ErrorBadInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const reqStream = await gwApi.storage.fetchProxy(attrs.meta, attrs.token);
      reqStream
        .on('downloadProgress', progress => {
          console.log(`Transferring: ${progress.transferred} KB`);
          if (progress.percent === 1) {
            console.log("Transfer completed");
          }
        })
        .pipe(res);
    } catch ( err ) {
      next(err);
    }
  };

  return [
    {
      path: 'add',
      call: addFile,
      method: 'post'
    },
    {
      path: 'fetch',
      call: fetchFile,
      method: 'get'
    },
  ];
};
