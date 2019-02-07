/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const { extractRequestAttrs } = require('../lib/request');
const { badInputResponse } = require('../lib/response');

module.exports = (gwApi) => {
  const addFile = async (req, res, next) => {
    const attrs = extractRequestAttrs(req, ['owner', 'password', 'file']);

    if (!attrs.owner || !attrs.password) {
      next(badInputResponse());
      return;
    }

    if (!attrs.file || !req.files.file) {
      next(badInputResponse());
      return;
    }

    try {
      const reqStream = gwApi.addProxy(attrs.owner, attrs.password, attrs.file);

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
    const attrs = extractRequestAttrs(req, ['meta', 'token']);
    if (!attrs.meta || !attrs.token) {
      next(badInputResponse());
      return;
    }

    try {
      const reqStream = gwApi.fetchProxy(attrs.meta, attrs.token);

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
