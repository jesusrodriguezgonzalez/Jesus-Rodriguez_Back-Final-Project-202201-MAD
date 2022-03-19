import { User } from '../models/user.models.js';
import { createError } from '../services/create-error.js';
import { errUpdateUser, createUserError, loginError } from '../utils/errors.js';
import { mongoConnect } from '../services/connection.js';
import { createToken } from '../services/auth.js';
import bcrypt from 'bcryptjs';
export const getAllUsers = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await User.find({});
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const registerUser = async (req, resp, next) => {
    try {
        const encryptedPasswd = bcrypt.hashSync(req.body.passwd);
        const userData = { ...req.body, passwd: encryptedPasswd };
        const result = await User.create(userData);
        resp.status(201);
        resp.json(result);
    } catch (error) {
        next(createUserError);
    }
};

export const login = async (req, resp, next) => {
    const user = req.body;
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

export const updateUser = async (req, res, next) => {
    try {
        const resp = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(resp);
    } catch (err) {
        next(errUpdateUser);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(202);
        res.json({ 'Deleted User': req.params.id });
    } catch (err) {
        next(createError(err));
    }
};
