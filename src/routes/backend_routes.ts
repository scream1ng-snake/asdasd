import { Router } from 'express'
import usersRouter from '../routers/usersRouter'

const backendRouter = Router()

export const backendRoutes = {
  '/users': '/users'
} as const
export type BackendRoute = typeof backendRoutes[keyof typeof backendRoutes]

// backendRoutes.use(jwtMiddleware)

backendRouter.use(backendRoutes['/users'], usersRouter)
export default backendRouter

