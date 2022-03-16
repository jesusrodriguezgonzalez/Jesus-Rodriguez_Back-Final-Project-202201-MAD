import { verifyToken } from '../services/auth.js';
import { tokenError } from '../utils/errors.js';
export const loginRequired = (req, res, next) => {
    const authorization = req.get('authorization');
    let token;

    let decodedToken;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        if (!decodedToken.iat) {
            next(tokenError);
        } else {
            req.tokenPayload = decodedToken;
            next();
        }
    } else {
        next(tokenError);
    }
};
