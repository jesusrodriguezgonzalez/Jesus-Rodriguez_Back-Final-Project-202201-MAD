import { verifyToken } from '../services/auth.js';
import { Incident } from '../models/incident.model.js';
import { tokenError, unAuthorized } from '../utils/errors.js';
export const checkCreatorIncidents = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const authorization = req.get('authorization');
    console.log(authorization);
    let token;
    let decodedToken;
    if (authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        const response = await Incident.findById(id);
        const { id_user } = response;
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
