import { Router } from 'express'
import usersRouter from '../routers/usersRouter'

const backendRoutes = Router()

// backendRoutes.use(jwtMiddleware)

backendRoutes.use('/users', usersRouter)

export default backendRoutes
