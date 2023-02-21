import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.mjs'
dotenv.config()

// Create Express app
const app = express()
const port = process.env.PORT || 3000

// Set the view engine to pug
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH
  }
  next()
})

// Query paths
app.get('/about', async (req, res) => {
  const [meta] = await client.getAllByType('meta')
  const [about] = await client.getAllByType('about')

  res.render('pages/home', { meta, about })
})

// app.get('/about', (req, res) => {
//   res.render('pages/about')
// })

// app.get('/collection', (req, res) => {
//   res.render('pages/collection')
// })

// app.get('/detail/:uid', (req, res) => {
//   res.render('pages/detail')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
