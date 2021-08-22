console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
export const isDev = process.env.NODE_ENV == 'development'
export const WEB_BASE = isDev ? `http://localhost:3000` : `https://personate.ai`
