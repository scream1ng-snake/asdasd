import { Router } from 'express'
import usersRouter from '../routers/usersRouter'
import scheduleRouter from '../routers/schedule.router'

const backendRouter = Router()

export const backendRoutes = {
  '/users': '/users',
  '/schedule': '/schedule',
} as const
export type BackendRoute = typeof backendRoutes[keyof typeof backendRoutes]

// backendRoutes.use(jwtMiddleware)

backendRouter.use(backendRoutes['/users'], usersRouter)
backendRouter.use(backendRoutes['/schedule'], scheduleRouter)
export default backendRouter

