'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/
const baseRoute = 'api/v1'

const Route = use('Route')

Route.on('/').render('welcome')

Route.group('crawl', () => {
  Route.get('/', 'Crawl/CrawlFacade.crawlTranslators')
}).prefix(`${baseRoute}/crawl`)

Route.group('webhook', () => {
  Route.get('/', 'Webhook/WebhookFacade.hook')
  Route.post('/', 'Webhook/WebhookFacade.getHook')
}).prefix(`${baseRoute}/webhook`)