const rdf = {
  ...require('@rdfjs/data-model'),
  ...require('@rdfjs/dataset')
}
const generateIri = require('./lib/generateIri')
const ns = require('./lib/namespaces')
const rebase = require('./lib/rebase')
const setGraph = require('./lib/setGraph')
const validate = require('./lib/validate')

async function get(req, res) {
  console.log('Inside drone get');
  if (req.dataset) {
    const filters = await req.dataset()

    const fromQuad = [...filters.match(null, ns.schema.from, null, null)][0]
    const from = fromQuad && fromQuad.object

    const toQuad = [...filters.match(null, ns.schema.to, null, null)][0]
    const to = toQuad && toQuad.object

    if (from || to) {
      console.log(`filter: ${from && from.value} - ${to && to.value}`)
    }
  }

  res.dataset(setGraph(req.hydra.resource.dataset))
}

module.exports = {
  get
}
