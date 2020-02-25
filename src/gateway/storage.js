/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
const ADD_FILE_PATH = `/storage/add`;
const ADD_RAW_PATH = `/storage/add-raw`;
const UPDATE_FILE_PATH = `/storage/update`;
const UPDATE_RAW_PATH = `/storage/update-raw`;
const ADD_FILE_WITH_ACL_PATH = `/storage/add-with-acl`;
const ADD_RAW_WITH_ACL_PATH = `/storage/add-raw-with-acl`;
const FETCH_FILE_PATH = `/storage/fetch`;
const STREAM_FILE_PATH = `/storage/stream`;
const META_PATH = `/storage/meta`;

const request = require('../http/request');
const {validateCid} = require('../leth/cid');

module.exports = (gwDomain) => ({

  /**
   * Uploaded new file into distributed storage
   * @param owner {string} Address of the owner of the file
   * @param password {string} The password that unlocks the owner
   * @param file {ReadableStream|File} File to add
   * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
   */
  add: (owner, password, file) => {
    if (typeof File !== 'undefined' && file instanceof File) {
      const reader = new FileReader();
      const fileBlob = file.slice(0, file.size);
      reader.readAsBinaryString(fileBlob);
    }
    return request.postFile(`${gwDomain}${ADD_FILE_PATH}`, {
      owner,
      password,
    }, file);
  },

  /**
   * Uploaded new file into distributed storage using raw data and fixed file type
   * @param owner {string} Address of the owner of the file
   * @param password {string} The password that unlocks the owner
   * @param rawData {string} File content in blob object
   * @param ext {string} Content extension format. For example: '.json', '.png'..
   * @returns { meta, acl }
   */
  addRaw: (owner, password, rawData, ext) => {
    if (typeof rawData !== 'string') {
      throw new Exception(`Argument "data" must be an string`);
    }

    return request.post(`${gwDomain}${ADD_RAW_PATH}`, {
      owner,
      password,
      data: rawData,
      ext: ext,
    });
  },

  /**
   * Uploaded new file into distributed storage using an already deployed acl
   * @param owner {string} Address of the owner of the file
   * @param acl {string} Address to acl contract
   * @param file {ReadableStream|File} File to add
   * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
   */
  addWithAcl: (owner, acl, file) => {
    if (typeof File !== 'undefined' && file instanceof File) {
      const reader = new FileReader();
      const fileBlob = file.slice(0, file.size);
      reader.readAsBinaryString(fileBlob);
    }
    return request.postFile(`${gwDomain}${ADD_FILE_WITH_ACL_PATH}`, {
      owner,
      acl,
    }, file);
  },

  /**
   * Uploaded new file into distributed storage using raw data and fixed file extension and using an already deployed acl
   * @param owner {string} Address of the owner of the file
   * @param acl {string} {string} Address to acl contract
   * @param rawData {string} File content in blob object
   * @param ext {string} Content extension format. For example: '.json', '.png'..
   * @returns { meta, acl }
   */
  addRawWithAcl: (owner, acl, rawData, ext) => {
    if (typeof rawData !== 'string') {
      throw new Error(`Argument "data" must be an string`);
    }

    return request.post(`${gwDomain}${ADD_RAW_WITH_ACL_PATH}`, {
      owner,
      acl,
      data: rawData,
      ext: ext,
    });
  },

  /**
   * Update distributed file content and link it to previous version
   * @param owner {string} Address of the owner of the file
   * @param meta {string} Unique identifier of stored file
   * @param file {ReadableStream|File} File to add
   * @returns {StreamResponse<{ meta, acl }>} | {<{ meta, acl }>}
   */
  update: (owner, meta, file) => {
    validateCid(meta);

    if (typeof File !== 'undefined' && file instanceof File) {
      const reader = new FileReader();
      const fileBlob = file.slice(0, file.size);
      reader.readAsBinaryString(fileBlob);
    }

    return request.postFile(`${gwDomain}${UPDATE_FILE_PATH}`, {
      meta,
      owner,
    }, file);
  },

  /**
   * Uploaded new file into distributed storage using raw data and fixed file extension
   * @param owner {string} Address of the owner of the file
   * @param password {string} The password that unlocks the owner
   * @param rawData {string} File content in blob object
   * @param ext {string} Content extension format. For example: '.json', '.png'..
   * @returns { meta, acl }
   */
  updateRaw: (owner, password, rawData, ext) => {
    if (typeof rawData !== 'string') {
      throw new Error(`Argument "data" must be a Blob`);
    }

    return request.post(`${gwDomain}${UPDATE_RAW_PATH}`, {
      owner,
      password,
      data: rawData,
      ext: ext,
    });
  },

  /**
   * Fetch file from distributed storage
   * @param meta {string} Unique identifier of stored file
   * @param token {string} Account authentication token
   * @param stream {boolean} Response to be streamed or not
   * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
   */
  fetch: (meta, token, stream) => {
    validateCid(meta);

    let reqData = {meta};
    if (token) {
      reqData = {...reqData, token};
    }
    return request.fetchFile(`${gwDomain}${FETCH_FILE_PATH}`, reqData, {
      stream,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Return an string with the GET url to fetch content from distributed storage
   * @param meta {string} Unique identifier of stored file
   * @param token {string} Account authentication token
   */
  fetchUrl: (meta, token) => {
    validateCid(meta);

    if (!token) {
      return `${gwDomain}${FETCH_FILE_PATH}?meta=${meta}`;
    }
    return `${gwDomain}${FETCH_FILE_PATH}?meta=${meta}&token=${encodeURI(token)}`;
  },

  /**
   * Stream file from distributed storage
   * @param meta {string} Unique identifier of stored file
   * @param token {string} Account authentication token
   * @param stream {boolean} Response to be streamed or not
   * @returns {StreamResponse<**CONTENT_FILE**>} || <**CONTENT_FILE**>
   */
  stream: (meta, token, stream) => {
    validateCid(meta);

    let reqData = {meta};
    if (token) {
      reqData = {...reqData, token};
    }

    return request.fetchFile(`${gwDomain}${STREAM_FILE_PATH}`, reqData, {
      stream,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Return an string with the GET url to fetch content from distributed storage
   * @param meta {string} Unique identifier of stored file
   * @param token {string} Account authentication token
   */
  streamUrl: (meta, token) => {
    validateCid(meta);

    if (!token) {
      return `${gwDomain}${STREAM_FILE_PATH}?meta=${meta}`;
    }
    return `${gwDomain}${STREAM_FILE_PATH}?meta=${meta}&token=${encodeURI(token)}`;
  },

  /**
   * Fetch metadata information about distributed file
   * @param meta {string} Unique identifier of stored file
   * @returns {Promise<{ filename, owner, ext, hash, acl, acl, prev_meta_hash }>}
   */
  meta: (meta) => {
    validateCid(meta);

    return request.get(`${gwDomain}${META_PATH}`, {
      meta,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
});

