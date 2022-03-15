import { verifyToken } from '../services/auth.js';
import { Apartment } from '../models/apartment.models.js';
export const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const authorization = req.get('authorization');
    let token;
    const tokenError = {
        message: 'token missing or invalid',
        status: '401',
        name: 'Unauthorized',
    };
    const unAuthorized = {
        message: 'Unauthorized',
        status: '401',
        name: 'Unauthorized',
    };
    let decodedToken;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        const apartment = await Apartment.findById(id);
        if (apartment.owner === decodedToken.id) {
            next();
        } else {
            next(unAuthorized);
        }
    } else {
        next(tokenError);
    }
};
