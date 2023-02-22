require('dotenv').config()

const express = require('express')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const prismic = require('@prismicio/client')
const prismicH = require('@prismicio/helpers')

// Set the view engine to pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  res.locals.PrismicH = prismicH

  next()
})

// init prismic api
const initApi = (req) => {
  return prismic.createClient(process.env.PRISMIC_REPO_NAME, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

// query paths
app.get('/about', async (req, res) => {
  const api = await initApi(req)

  const [meta] = await api.getAllByType('meta')
  const [about] = await api.getAllByType('about')

  res.render('pages/about', { meta, about })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)

  const uid = req.params.uid
  const [meta] = await api.getAllByType('meta')
  const product = await api.getByUID('product', uid, {
    fetchLinks: 'collection.title'
  })

  console.log(product.data)

  res.render('pages/detail', { meta, product })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
