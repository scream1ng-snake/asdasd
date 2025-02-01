import { Request, Response } from 'express'
import usersService from "../services/usersService";
import { HttpError } from '../utils/http.error';


class usersController {
  getOne(req: Request, res: Response) {
    if(req.query.id) return usersService.getOne(req.query.id as string)
    if(req.query.tgId) return usersService.getByTgId(req.query.tgId as string)
    throw new HttpError(400, 'no tgId or id param')
  }
  getMasters(req: Request, res: Response) {
    return usersService.getMasters()
  }
  
}

export default new usersController()