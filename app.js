require('dotenv').config()

const express = require('express')
const fetch = require('node-fetch')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const methodOverride = require('method-override')

const prismic = require('@prismicio/client')
const prismicH = require('@prismicio/helpers')

// Express configurations
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())

// Set the view engine to pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  res.locals.PrismicH = prismicH

  // Add a helper function to list all the collections
  res.locals.Numbers = (index) => {
    return index === 0
      ? 'One'
      : index === 1
      ? 'Two'
      : index === 2
      ? 'Three'
      : index === 3
      ? 'Four'
      : ''
  }

  next()
})

// Init prismic api
const initApi = (req) => {
  return prismic.createClient(process.env.PRISMIC_REPO_NAME, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

// Routes
app.get('/', async (req, res) => {
  const api = await initApi(req)
  const [meta] = await api.getAllByType('meta')
  const [preloader] = await api.getAllByType('preloader')
  const [home] = await api.getAllByType('home')
  const collections = await api.getAllByType('collection', {
    fetchLinks: 'product.image'
  })
  res.render('pages/home', { meta, preloader, home, collections })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const [meta] = await api.getAllByType('meta')
  const [preloader] = await api.getAllByType('preloader')
  const [about] = await api.getAllByType('about')
  res.render('pages/about', { meta, preloader, about })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const uid = req.params.uid
  const [meta] = await api.getAllByType('meta')
  const [preloader] = await api.getAllByType('preloader')
  const product = await api.getByUID('product', uid, {
    fetchLinks: 'collection.title'
  })
  res.render('pages/detail', { meta, preloader, product })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const [meta] = await api.getAllByType('meta')
  const [preloader] = await api.getAllByType('preloader')
  const [home] = await api.getAllByType('home')
  const collections = await api.getAllByType('collection', {
    fetchLinks: 'product.image'
  })
  res.render('pages/collections', { meta, preloader, home, collections })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
