import { Request, Response } from 'express'
import usersService from "../services/usersService";


class usersController {
  getOne(req: Request, res: Response) {
    if(!req.params.id) {
      res.sendStatus(400)
    } else {
      return usersService.getOne(req.params.id)
    }
  }
}

export default new usersController()