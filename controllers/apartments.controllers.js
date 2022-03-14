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
        res.json(result);
    } catch (error) {
        next(createError(error));
    }
};
