import { User } from '../models/user.models.js';
import { createError } from '../services/create-error.js';
import { mongoConnect } from '../services/connection';
import { createToken, verifyToken } from '../services/auth.js';
import bcrypt from 'bcryptjs';
export const getAllUsers = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await User.find({});
        res.json(resp);
    } catch (err) {
        throw new Error(err);
    }
};

export const registerUser = async (req, resp, next) => {
    if (req.body) {
        try {
            const encryptedPasswd = bcrypt.hashSync(req.body.passwd);
            const userData = { ...req.body, passwd: encryptedPasswd };
            const result = await User.create(userData);
            resp.json(result);
        } catch (error) {
            next(createError(error));
        }
    } else {
        resp.status(400);
        resp.json({ message: 'Error creating user' });
    }
};
