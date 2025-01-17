import { Request, Response, NextFunction } from 'express' 
import { HttpError } from '../utils/http.error';

/** Middleware для отлова ошибок */
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {  
  if (err instanceof HttpError) {  
    res.status(err.status).json({ error: err.message })
  } else {  
    console.error(err.stack)  
    res.status(500).json({ error: 'Что-то пошло не так!' });  
  }  
}

export default errorMiddleware