import { verifyToken } from '../services/auth.js';
import { Incident } from '../models/incident.model.js';
export const checkCreatorIncidents = async (req, res, next) => {
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
        const { id_user } = await Incident.findById(id);
        const idUserIncident = id_user.toString();

        if (idUserIncident === decodedToken.id) {
            next();
        } else {
            next(unAuthorized);
        }
    } else {
        next(tokenError);
    }
};
