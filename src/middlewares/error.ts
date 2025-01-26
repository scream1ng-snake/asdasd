import { Request, Response, NextFunction } from 'express' 
import { HttpError } from '../utils/http.error';
import { ValidationError } from 'yup';

/** Middleware для отлова ошибок */
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {  
  if (err instanceof HttpError) {  
    res.status(err.status).json({ error: err.message })
  } else if(err instanceof ValidationError) {
    res.status(400).json({ error: err.message })
  } else {  
    console.error(err.stack)  
    res.status(500).json({ error: 'Что-то пошло не так!' });  
  }  
}

export default errorMiddleware