import { User } from '../models/user.models.js';
import { createError } from '../services/create-error.js';
export const getAllUsers = async (req, res, next) => {
    try {
        const resp = await User.find({});
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};
