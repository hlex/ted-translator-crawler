'use strict'

const cheerio = require('cheerio')

const FacadeController = require('../../Core/FacadeController')
const Webhook = require('./WebhookProcessor')

module.exports = class PostFacade extends FacadeController {
  constructor () {
    super()
    this.webhook = new Webhook()
  }
  async hook ({ request, params }) {
    const requestBody = request.all()
    console.log(requestBody)
    return requestBody['hub.challenge']; // this.responseWithSuccess({ request, params, data })
  }
  async getHook ({ request, params }) {
    const requestBody = request.all()
    console.log(requestBody)
    const data = [] // await this.webhook.crawlingTranslators({ request, params })
    return this.responseWithSuccess({ request, params, data })
  }
}
