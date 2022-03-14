import { User } from '../models/user.models.js';
import { createError } from '../services/create-error.js';
import { mongoConnect } from '../services/connection';
export const getAllUsers = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await User.find({});
        res.json(resp);
    } catch (err) {
        throw new Error(err);
    }
};
