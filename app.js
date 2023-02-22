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

// Init prismic api
const initApi = (req) => {
  return prismic.createClient(process.env.PRISMIC_REPO_NAME, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

const HandleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'collections') {
    return '/collections'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  // Default to homepage
  return '/'
}

// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  res.locals.PrismicH = prismicH
  res.locals.Link = HandleLinkResolver

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

const handleRequest = async (api) => {
  const [meta] = await api.getAllByType('meta')
  const [preloader] = await api.getAllByType('preloader')
  const [navigation] = await api.getAllByType('navigation')

  return {
    meta,
    navigation,
    preloader
  }
}

// Routes
app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const [home] = await api.getAllByType('home')
  const collections = await api.getAllByType('collection', {
    fetchLinks: 'product.image'
  })

  console.log({ ...defaults }.navigation.data.list)

  res.render('pages/home', {
    ...defaults,
    home,
    collections
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const [about] = await api.getAllByType('about')

  res.render('pages/about', {
    ...defaults,
    about
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/detail', {
    ...defaults,
    product
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const [home] = await api.getAllByType('home')
  const collections = await api.getAllByType('collection', {
    fetchLinks: 'product.image'
  })

  res.render('pages/collections', {
    ...defaults,
    home,
    collections
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
