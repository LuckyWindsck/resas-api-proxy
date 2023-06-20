export const config = {
  runtime: 'edge',
}

export default async (request: Request) => {
  const { origin } = new URL(request.url)
  const baseURL = 'https://opendata.resas-portal.go.jp'
  const apiURL = request.url.replace(origin, baseURL)
  const RESAS_API_KEY = process.env.VITE_RESAS_API_KEY || ''
  const response = await fetch(apiURL, { headers: { 'X-API-KEY': RESAS_API_KEY } })
  const json = (await response.json()) as object

  return new Response(JSON.stringify(json))
}
