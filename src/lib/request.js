/**
 * User: ggarrido
 * Date: 12/02/19 12:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { parseResponse } = require('./response');

function queryParams(params) {
  const paramKeys = Object.keys(params);
  if (!paramKeys.length) {
      return ''
  }
  return '?' + Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

module.exports = (() => {
  const fetch = require('node-fetch');

  const defaultOptions = {
    json: true,
    throwHttpErrors: false,
    followRedirect: false,
  };

  const get = (url, data, options = {}) => {
    return fetch(url + queryParams(data), {
      ...defaultOptions,
      method: 'GET',
      ...options
    }).then(parseResponse);
  };

  const post = (url, data, options = {}) => {
    return fetch(url, {
      ...defaultOptions,
      ...options,
      body: JSON.stringify(data),
      method: 'POST',
    }).then(parseResponse);
  };

  const postFile = (url, data, file) => {
    const FormData = require('form-data');
    var form = new FormData();
    form.append('file', file);
    Object.keys(data).forEach(dataKey => {
      form.append(dataKey, data[dataKey]);
    });

    // const headers = (typeof form.getHeaders === 'function')
    //   ? form.getHeaders()
    //   : {
    //     'Content-Type': 'multipart/form-data'
    //   };

    return fetch(url, {
      body: form,
      method: 'POST'
    }).then(parseResponse);
  };

  const fetchFile = (url, data, options = {}) => {
    return fetch(url + queryParams(data), {
      ...defaultOptions,
      ...options,
      method: 'GET',
    }).then((res) => {
      if(options['stream']) {
        return res;
      }

      if (res.status === 200) {
        return parseResponse(res)
      } else {
        // if (res.headers.get('content-type').indexOf('json') !== -1) {
        return {
          status: res.status,
          message: res.statusText
        }
      }
    });
  };

  return {
    get,
    post,
    postFile,
    fetchFile
  }
})();