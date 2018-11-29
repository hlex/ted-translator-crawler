const fetch = require('isomorphic-fetch')
const fs = require('fs');
const request = require('request');
const progress = require('request-progress');

const fetchUtils = {
  fetchFacade: ({ url, responseType = 'json' }) => {
    return fetch(url)
      .then(response => responseType === 'json' ? response.json() : response.text())
      .then(response => {
        return response
      })
  },
  download: (uri, path, onProgress, onResponse, onError, onEnd) => {
    progress(request(uri))
      .on('progress', onProgress)
      .on('response', onResponse)
      .on('error', onError)
      .on('end', onEnd)
      .pipe(fs.createWriteStream(path))
  }
}

module.exports = fetchUtils
