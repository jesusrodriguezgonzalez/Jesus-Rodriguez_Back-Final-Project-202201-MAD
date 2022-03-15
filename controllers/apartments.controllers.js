import { mongoConnect } from '../services/connection.js';
import { createError } from '../services/create-error.js';
import { Apartment } from '../models/apartment.models.js';
export const getAllApartments = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await Apartment.find({});
        res.status(200).json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const getApartment = async (req, res, next) => {
    try {
        const resp = await Apartment.findById(req.params.id)
            .populate('id_apartment', {
                age: 0,
                rol: 0,
                city: 0,
                current_user: 0,
                history_user: 0,
                photos: 0,
                incidents: 0,
                status: 0,
            })
            .populate('id_user', {
                email: 0,
                age: 0,
                city: 0,
                apartment_history: 0,
                direction: 0,
                rol: 0,
                current_apartment: 0,
            });
        res.status(200);
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const deleteApartment = async (req, res, next) => {
    try {
        await Apartment.findByIdAndDelete(req.params.id);
        res.json({ 'Deleted Apartment': req.params.id });
    } catch (err) {
        next(createError(err));
    }
};

export const updateApartment = async (req, res, next) => {
    try {
        const resp = await Apartment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const newApartment = async (req, res, next) => {
    try {
        const result = await Apartment.create(req.body);
        res.status(201);
        res.json(result);
    } catch (error) {
        next(createError(error));
    }
};
