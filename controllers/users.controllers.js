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

export const login = async (req, resp, next) => {
    const user = req.body;

    const loginError = new Error('User or password invalid');
    loginError.status = 401;
    if (!user.email || !user.passwd) {
        next(loginError);
    } else {
        const userFound = await User.findOne({
            email: user.email,
        });
        if (!userFound) {
            next(loginError);
        } else if (
            bcrypt.compareSync(user.passwd, userFound.passwd) === false
        ) {
            next(loginError);
        } else {
            const token = createToken({
                email: userFound.email,
                id: userFound.id,
            });
            resp.json({
                token,
                email: userFound.email,
                id: userFound.id,
                image: userFound.image,
            });
        }
    }
};
