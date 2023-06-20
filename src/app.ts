import axios from 'axios'
import Koa from 'koa'
import KoaJson from 'koa-json'
import KoaLogger from 'koa-logger'

interface SuccessResponse {
  message: string | null
  result: object
}

interface ErrorResponse {
  statusCode: string
  message: string
  description: string
}

type SearchResponse = SuccessResponse | ErrorResponse

const resasAPI = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp',
  headers: {
    'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
  },
})

const apiProxy: Koa.Middleware = async (ctx, next) => {
  const requestURL = new URL(ctx.URL.toString())
  requestURL.searchParams.delete('pretty')
  const apiURL = requestURL.toString().replace(requestURL.origin, '')
  const response = await resasAPI.get<SearchResponse>(apiURL)
  ctx.body = response.data

  return next()
}

const app = new Koa()

app.use(KoaLogger())
app.use(KoaJson({ pretty: false, param: 'pretty' }))
app.use(apiProxy)

if (import.meta.env.PROD) {
  app.listen(3000)
}

// eslint-disable-next-line import/prefer-default-export -- vite needs a named export viteNodeApp
export const viteNodeApp = app
