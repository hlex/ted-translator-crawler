'use strict'

const Humps = require('humps')
const Env = use('Env')
const Validator = use('Validator')
const Helpers = use('Helpers')

const ValidationException = require('../Exceptions/ValidationException')
const fs = require('fs')
const _ = require('lodash')

module.exports = class AppController {
  constructor () {
    this.syncJsonFolderPath = `${Helpers.publicPath()}/sync/json`
  }
  async validate (data, rules, messages) {
    const validation = await Validator.validate(data, rules, messages)
    if (validation.fails()) {
      this.throwException(401, {
        th: validation.messages()[0].message || '',
        en: validation.messages()[0].message || '',
        technical: validation.messages()[0].message || ''
      })
    }
  }
  getAssetDownloadURL (asset) {
    const modifyPath = asset.src
    return `${Env.get('APP_URL', '')}${modifyPath}`
  }
  getAssetJsonURL (asset) {
    const modifyPath = _.replace(asset.src, 'sync', 'content')
    return `.${modifyPath}`
  }
  exportJsonToSync ({ data, fileName }) {
    fs.writeFile(`${this.syncJsonFolderPath}/${fileName}.json`, data, err => {
      if (err) throw err
      console.log(`Export data to file ${this.syncJsonFolderPath}/${fileName}.json success`)
    })
  }
  toEndUserSrc (src) {
    return `${Env.get('APP_URL', '')}${src}`
  }
  toEndUserImage (image) {
    return {
      ...image.asset,
      id: image.asset.id,
      name: image.asset.name,
      downloadURL: `${this.toEndUserSrc(image.asset.src)}`,
      status: 'uploaded'
    }
  }
  throwException (code, messages) {
    throw new ValidationException(code, messages)
  }
  toCamelCase (data) {
    return Humps.camelizeKeys(data)
  }
  toJSON (rawData) {
    let jsonData = rawData
    if (typeof rawData.toJSON === 'function') {
      jsonData = rawData.toJSON()
    }
    return jsonData
  }
  responseWithSuccess ({ request, params, data }) {
    return {
      status: 'success',
      trxId: Date.now(),
      data,
      meta: {
        params: params,
        query: request.get(),
        body: request.post(),
        hostname: request.hostname(),
        method: request.method(),
        location: request.originalUrl(),
        ip: request.ip(),
      }
    }
  }
  responseWithError ({ request, params, errorCode, errors }) {
    const message = _.get(errors, '0.messages.technical', '')
    return {
      status: 'error',
      trxId: Date.now(),
      message,
      code: errorCode,
      errors,
      meta: {
        params: params,
        query: request.get(),
        body: request.post(),
        hostname: request.hostname(),
        method: request.method(),
        location: request.originalUrl(),
        ip: request.ip()
      }
    }
  }
}
