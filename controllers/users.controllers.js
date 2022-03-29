import { User } from '../models/user.models.js';
import { createError } from '../services/create-error.js';
import { errUpdateUser, loginError } from '../utils/errors.js';
import { mongoConnect } from '../services/connection.js';
import { createToken, verifyToken } from '../services/auth.js';
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
        next(createError(error, 400));
    }
};

export const login = async (req, resp, next) => {
    const user = req.body;
    if (!user.email || !user.passwd) {
        next(loginError);
    } else {
        const userFound = await User.findOne({
            email: user.email,
        })
            .populate({
                path: 'apartments_owner',
                populate: {
                    select: 'name surname rol image',
                    path: 'current_tenant',
                },
            })
            .populate({
                path: 'apartments_owner',
                populate: {
                    select: 'name surname rol',
                    path: 'owner',
                },
            })
            .populate({
                path: 'current_apartment',
                populate: {
                    select: 'name surname rol',
                    path: 'owner',
                },
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
                name: userFound.name,
                surname: userFound.surname,
                age: userFound.age,
                phone: userFound.phone,
                city: userFound.city,
                direction: userFound.direction,
                current_apartment: userFound.current_apartment,
                apartments_owner: userFound.apartments_owner,
                image: userFound.image,
                rol: userFound.rol,
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

export const loginWithToken = async (req, res, next) => {
    const authorization = req.get('authorization');
    if (!authorization) {
        next(loginError);
    } else {
        let token;
        let decodedToken;
        if (authorization.toLowerCase().startsWith('bearer')) {
            token = authorization.substring(7);
            decodedToken = verifyToken(token);
            const userFound = await User.findById(decodedToken.id)
                .populate({
                    path: 'apartments_owner',
                    populate: {
                        select: 'name surname rol image phone',
                        path: 'current_tenant',
                    },
                })
                .populate({
                    path: 'apartments_owner',
                    populate: {
                        select: 'name surname rol phone',
                        path: 'owner',
                    },
                })
                .populate({
                    path: 'current_apartment',
                    populate: {
                        select: 'name surname rol phone',
                        path: 'owner',
                    },
                });
            res.json(userFound);
        }
    }
};
