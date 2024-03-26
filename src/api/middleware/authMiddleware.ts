import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // TODO:
    // implement authentication logic here
    // Example: Check if user is authenticated
    // if (req.isAuthenticated()) {
    if (true) {
        return next();
    } else {
        res.status(401).json({ error: 'Unauthorized' } );
    }
};



//Example 2:
// import jwt from 'jsonwebtoken';
// import { config } from '../config';
//
// export const authenticate = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(403).json({ error: 'No token provided.' });
//     }
//     jwt.verify(token, config.jwt.secret, (err, decoded) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to authenticate token.' });
//         }
//         req.userId = decoded.id;
//         next();
//     });
// };
