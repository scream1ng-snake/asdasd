// import { StatusCodes, ReasonPhrases } from "http-status-codes";
// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';


// const JWT_SECRET = 'secret'
// const jwtMiddleware = async function (req: Request, res: Response, next: NextFunction) {
//     if (req.method === 'OPTIONS') {
//         next()
//     }
//     try {
//         if (req.headers.authorization !== undefined) {
//             const token = req.headers.authorization.split(' ')[1]
//             if (!token) {
//                 return res.status(StatusCodes.UNAUTHORIZED)
//                   .send({errorMessage: ReasonPhrases.UNAUTHORIZED})
//             }
//             const decodedToken = jwt.verify(token, JWT_SECRET)
//             req.user = decodedToken
//             next()
//         }
//     } catch (error) {
//         return res.status(StatusCodes.UNAUTHORIZED).send({errorMessage: ReasonPhrases.UNAUTHORIZED})
//     }
// }

// export default jwtMiddleware