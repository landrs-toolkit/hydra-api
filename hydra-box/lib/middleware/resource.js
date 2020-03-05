const debug = require('debug')('hydra-box:resource')
const clownface = require('clownface')
const ns = require('../namespaces')
const { fromStream } = require('rdf-dataset-ext')
const rdf = { ...require('@rdfjs/data-model'), ...require('@rdfjs/dataset') }
const TermSet = require('@rdfjs/term-set')

async function loadResource (store, term) {
  const dataset = await fromStream(rdf.dataset(), store.match(null, null, term, null))

  if (dataset.size === 0) {
    return null
  }

  const subject = [...dataset][0].subject
  const types = new TermSet(clownface({ dataset, subject }).out(ns.rdf.type).terms)

  return {
    term,
    dataset,
    types
  }
}

function factory (store) {
  return async (req, res, next) => {
    req.hydra.resource = await loadResource(store, req.hydra.term)

    if (req.hydra.resource) {
      debug(`IRI: ${req.hydra.resource.term.value}`)
      debug(`types: ${[...req.hydra.resource.types].map(term => term.value).join(' ')}`)
    } else {
      debug(`no matching resource found: ${req.hydra.term.value}`)
    }

    next()
  }
}

module.exports = factory
