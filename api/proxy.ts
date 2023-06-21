export const config = {
  runtime: 'edge',
}

export default async (request: Request) => {
  const { origin } = new URL(request.url)
  const baseURL = 'https://opendata.resas-portal.go.jp'
  const apiURL = request.url.replace(origin, baseURL)
  const { RESAS_API_KEY = '' } = process.env
  const response = await fetch(apiURL, { headers: { 'X-API-KEY': RESAS_API_KEY } })
  const json = (await response.json()) as object

  return new Response(JSON.stringify(json), {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  })
}
