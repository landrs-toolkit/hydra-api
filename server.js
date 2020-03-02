const express = require('express')
const FlatMultiFileStore = require('rdf-store-fs/FlatMultiFileStore')
const hydraBox = require('hydra-box')
const ResourceStore = require('./lib/ResourceStore')

async function main () {
  const store = new FlatMultiFileStore({
    baseIRI: 'http://ld.landrs.org/',
    path: 'store'
  })

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
