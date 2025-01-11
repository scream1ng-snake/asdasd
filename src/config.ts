import dotenv from 'dotenv'
dotenv.config()

const config = {
  dev: true,
  port: process.env.APP_PORT,
  https: process.env.APP_HTTPS === 'true',
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  tg: {
    botToken: process.env.TG_BOT_TOKEN
  }
}
export default config