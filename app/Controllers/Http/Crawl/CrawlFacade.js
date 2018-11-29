'use strict'

const cheerio = require('cheerio')

const FacadeController = require('../../Core/FacadeController')
const CrawlProcessor = require('./CrawlProcessor')

module.exports = class PostFacade extends FacadeController {
  constructor () {
    super()
    this.crawlProcessor = new CrawlProcessor()
  }
  async crawlTranslators ({ request, params }) {
    const data = await this.crawlProcessor.crawlingTranslators({ request, params })
    return this.responseWithSuccess({ request, params, data })
  }
}
