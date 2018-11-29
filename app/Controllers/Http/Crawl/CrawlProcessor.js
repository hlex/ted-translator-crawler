'use strict'

const Helpers = use('Helpers')

const _ = require('lodash')
const cheerio = require('cheerio')

const ProcessorController = require('../../Core/ProcessorController')

const FetchUtils = require('../../../Utils/fetch')
const CommonUtils = require('../../../Utils/common')
const ExcelUtils = require('../../../Utils/excel')


const getTargetURL = (page) => `https://www.ted.com/people/translators?languages=thai&page=${page}&sort=translations`

const getFileNameFromURL = (thumbnailURL) => {
  const getFileNameRegex = /(\d|\w)+.(jpg|png)$/ig
  const [fileName] = getFileNameRegex.exec(thumbnailURL)
  const cleanedFileName = `${Date.now()}-${CommonUtils.replaceAll(fileName, ' ', '_')}`
  return cleanedFileName
}
const downloadFile = async (url) => {
  const filename = getFileNameFromURL(url)
  return new Promise((resolve, reject) => {
    FetchUtils.download(
      url,
      `${Helpers.publicPath('sync/images')}/${filename}`,
      function (state) {
        // console.log('progress', state)
      },
      response => {
        // console.log('status code', response.statusCode)
      },
      error => {
        console.log('error', error)
      },
      async () => {
        console.log(`download file = ${filename} from ${url} done`)
        resolve(filename)
      }
    )
  })
}

module.exports = class CrawlProcessor extends ProcessorController {
  constructor () {
    super()
  }
  // async creatingPostFromHtmlTemplate (nodeId, $) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const title = $('h1.title[property="dc:title"]')
  //         .text()
  //       console.log('title =', title)
  //       const description = $('.field-item[property="content:encoded"]')
  //         .text()
  //       console.log('description =', description)
  //       const thumbnailURL = $('img', '.field-name-field-image')
  //         .attr('src')
  //       const imgElements = $('img', '.field-item[property="content:encoded"]').get()
  //       const imagesURL = _.map(imgElements, (imgElement) => `${CRAWL_TARGET_URL}${$(imgElement).attr('src')}`)
  //       // add thumbnail image to download list
  //       imagesURL.unshift(thumbnailURL)
  //       const downloadFilePromise = _.map(imagesURL, async (url) => {
  //         return downloadFile(url)
  //       })
  //       const files = await Promise.all(downloadFilePromise)
  //       const createdPost = await Post.create({
  //         nlt_node_id: nodeId,
  //         post_type_id: 1,
  //         title_th: title,
  //         title_en: title,
  //         description_th: description,
  //         description_en: description,
  //         active: true
  //       })
  //       for (let i = 0; i < files.length; i += 1) {
  //         const filename = files[i]
  //         const createdAsset = await this.assetProcessor.creatingAsset({ fileName: filename })
  //         await this.assetOwnerProcessor.creatingAssetOwner({
  //           asset: createdAsset,
  //           owner: `post/${createdPost.id}`
  //         })
  //       }
  //       console.log('')
  //       console.log('============ Fetch Post = ', nodeId, 'success.')
  //       console.log('')
  //       console.log('')
  //       resolve(true)
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  extractSummary(string) {
    console.log(string)
    const rx = /<br>(.*)<br>/igm;
    const arr = rx.exec(string);
    console.log('extractSummary', arr)
    return arr[1];
  }

  async extractTranslatorData ($, i) {
    return new Promise((resolve, reject) => {
      const [province, country] = $('div.results a.results__result > div.media__message > p.p4 > strong').eq(i).text().split(', ')
      const [talksCount] = $('div.results a.results__result > div.media__message > p.p4 em').eq(i).text().split(' ')
      const profileHtml = $('div.results a.results__result > div.media__message > p.p4').eq(i).html()
      const translateLang =  this.extractSummary(profileHtml)
      const member = {
        avatar: 'https://www.ted.com' + $('div.results a.results__result').eq(i).attr('href'),
        fullname: _.trim(CommonUtils.replaceAll($('div.results a.results__result > div.media__message > h4.h7').eq(i).text(), '\n', ' ')),
        province: province,
        country: country,
        translateLang,
        talksCount,
        profileUrl: $('div.results a.results__result img.thumb__image').eq(i).attr('src')
      }
      resolve(member)
    })
  }

  async crawlingTranslators ({ request, params }) {
    let results = []
    const MAX_PAGE = 12
    for (let page = 1; page <= MAX_PAGE; page += 1) {
      const url = getTargetURL(page)
      const html = await FetchUtils.fetchFacade({
        url: `${url}`,
        responseType: 'text'
      })
      const $ = cheerio.load(html)
      const numberOfMember = $('div.results a.results__result').length
      console.log('Page', page, numberOfMember)
      for (let i = 0; i < numberOfMember; i += 1) {
        // avatar | fullname | province | country | translate_lang | talks_count | profile_url
        const member = await this.extractTranslatorData($, i)
        results.push(member)
      }
    }
    console.log('====== FINISH =======')
    return results
  }
}
