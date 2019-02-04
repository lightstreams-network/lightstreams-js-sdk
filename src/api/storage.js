/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */


const ADD_FILE_URL = `${urls.GATEWAY_DOMAIN}/acl/add`;
const FETCH_URL = `${urls.GATEWAY_DOMAIN}/storage/fetch`;

module.exports.add = (file, owner, password) => {

};

module.exports.fetch = (req, res, lethToken, contentMeta, filename) => {
  const url = new URL(FETCH_URL);
  var query = querystring.stringify({
    meta: contentMeta,
    token: lethToken
  });

  var options = {
    host: url.hostname,
    port: url.port,
    path: `${url.pathname}?${query}`,
    method: 'GET',
    headers: req.headers,
  };

  debug(`GET: ${FETCH_URL}\t${JSON.stringify(options)}`);
  var creq = https.request(options, function(cres) {
    // if (typeof cres.headers['content-disposition'] !== "undefined") {
    //     res.setHeader('Content-Length', cres.headers['content-length']);
    //     res.setHeader('Content-Type', cres.headers['content-type']);
    //     res.setHeader('Content-Disposition', cres.headers['content-disposition']);
    // } else {
    res.setHeader('Content-Type', ext2MIME(extractExtension(filename)));
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // }

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    cres.pipe(res);
  }).on('error', function(e) {
    // we got an error, return 500 error to client and log error
    res.writeHead(500);
    res.end();
  });

  req.pipe(creq);
};