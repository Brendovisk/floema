import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH
  }
  next()
})

app.get('/', async (req, res) => {
  const document = await client.getFirst()
  res.render('pages/home', { document })
  console.log(document)
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
