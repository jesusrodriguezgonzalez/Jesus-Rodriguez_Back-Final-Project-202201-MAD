import { verifyToken } from '../services/auth.js';
import { Apartment } from '../models/apartment.models.js';
import { tokenError, unAuthorized } from '../utils/errors.js';

export const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const authorization = req.get('authorization');
    console.log(authorization);
    let token;

    let decodedToken;
    if (authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        console.log(decodedToken, 'token');
        const apartment = await Apartment.findById(id);
        console.log(apartment.owner.toString(), 'apartamento');
        console.log(apartment.owner.toString() === decodedToken);

        if (apartment.owner.toString() === decodedToken.id) {
            next();
        } else {
            next(unAuthorized);
        }
    } else {
        next(tokenError);
    }
};
