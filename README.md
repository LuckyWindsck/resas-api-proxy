# resas-api-proxy

A simple proxy server for [RESAS-API](https://opendata.resas-portal.go.jp/) deploying on [Vercel](https://vercel.com/)

## Project Setup

```sh
yarn install
yarn vercel deploy
yarn vercel env add RESAS_API_KEY # enter your API Key and select neccessary environment
yarn git connect # if you fork this repo
```

### Development

```sh
yarn vercel dev
```

### Deploy to vercel

```sh
yarn vercel deploy
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint:fix
```

### Format with [Prettier](https://prettier.io/)

```sh
yarn format:fix
```
