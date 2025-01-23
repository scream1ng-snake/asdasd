import { Request, Response, NextFunction } from 'express';  

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> 

const asyncHandler = (fn: AsyncRequestHandler) => {  
  return (req: Request, res: Response, next: NextFunction) => {  
    Promise.resolve(fn(req, res, next)).then(  
      (result) => {  
        res.status(200).json(result);  
      }  
    ).catch(next); 
  };  
};  

export default asyncHandler;