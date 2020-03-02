const express = require('express')
const SPARQLStore = require('rdf-store-sparql')
const hydraBox = require('hydra-box')
const ResourceStore = require('./lib/ResourceStore')

async function main () {
  const store = new SPARQLStore(
    'http://fuseki-geosparql:3030/ds',
    {updateUrl: 'http://fuseki-geosparql:3030/ds/update'}
  )

  const api = await hydraBox.Api.fromFile('api.ttl', {
    path: '/api',
    codePath: __dirname,
  })

  const app = express()
  app.locals.store = new ResourceStore({ quadStore: store })
  app.use(hydraBox.middleware(api, store))
  app.listen(9000)
}

main()
