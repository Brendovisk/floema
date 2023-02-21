import fetch from 'node-fetch'
import * as prismic from '@prismicio/client'
import dotenv from 'dotenv'
dotenv.config()

const repoName = process.env.PRISMIC_REPO_NAME
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const routes = [
  {
    type: 'collection',
    uid: 'vita-collection',
    path: '/'
  }
]

export const client = prismic.createClient(repoName, {
  fetch,
  accessToken,
  routes
})
