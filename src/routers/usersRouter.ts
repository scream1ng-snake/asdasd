import { Router } from 'express'
import usersController from '../controllers/usersController'
import asyncHandler from '../middlewares/asyncHandle'

const usersRouter = Router()
usersRouter.get('/', asyncHandler(usersController.getOne))

export default usersRouter