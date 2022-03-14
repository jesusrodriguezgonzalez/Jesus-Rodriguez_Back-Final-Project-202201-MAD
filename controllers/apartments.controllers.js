import { mongoConnect } from '../services/connection';
import { createError } from '../services/create-error';
import { Apartment } from '../models/apartment.models.js';
export const getAllApartments = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await Apartment.find({});
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const getApartment = async (req, res, next) => {
    try {
        const resp = await Apartment.findById(req.params.id);
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};