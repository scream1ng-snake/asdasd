import { Router } from 'express'
import usersController from '../controllers/usersController'
import asyncHandler from '../middlewares/asyncHandle'

const usersRouter = Router()
usersRouter.get('/', asyncHandler(usersController.getOne))
usersRouter.get('/master', asyncHandler(usersController.getMasters))

export default usersRouter