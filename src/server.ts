import express from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'
import backendRoutes from './routes/backend_routes'
import { frontendRoutes } from './routes/frontend_routes'
import { dataSource } from './db/dataSource'
import config from './config'
import { Logger } from './utils/logger'
import errorMiddleware from './middlewares/error'

export class ServerApp {
  private prefix = '/api'
  private app: express.Application = express()
  logger = new Logger('server')

  configure() {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(this.prefix, backendRoutes)  
    this.app.use(errorMiddleware)
    frontendRoutes.forEach(route => this.app.use(route, express.static('./static')))
  }

  startHttps() {
    const key = fs.readFileSync('ssl/key.pem', 'utf8')
    const cert = fs.readFileSync('ssl/cert.pem', 'utf8')
    if(!key || !cert) {
      console.error('No key or cert')
      process.exit(1)
    }
    const credentials = { key, cert }
    const httpsServer = https.createServer(credentials, this.app)
    httpsServer.listen(config.port, () => {
      this.logger.log('HTTPS started on port: ' + config.port)
    })
    
     
  }
  start() {
    const httpServer = http.createServer(this.app)
    httpServer.listen(config.port, () => {
      this.logger.log('HTTP started on port: ' + config.port)
    })
  }

  constructor() {
    this.configure()
    dataSource
      .initialize()
      .then(() => {
        if (config.https === true) {
          this.startHttps()
        } else {
          this.start()
        }
      })
      .catch(console.error)
  }
}