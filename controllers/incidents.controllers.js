import { mongoConnect } from '../services/connection.js';
import { Incident } from '../models/incident.model.js';
import { createError } from '../services/create-error.js';

export const getAllIncidents = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await Incident.find({})
            .populate('id_apartment', {
                current_rented: 0,
                history_rented: 0,
                status: 0,
                photos: 0,
                incidents: 0,
            })
            .populate('id_user', {
                age: 0,
                city: 0,
                direction: 0,
                apartment_history: 0,
                rol: 0,
            });
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const getIncidents = async (req, res, next) => {
    try {
        const resp = await Incident.findById(req.params.id)
            .populate('id_apartment', {
                current_rented: 0,
                history_rented: 0,
                status: 0,
                photos: 0,
                incidents: 0,
            })
            .populate('id_user', {
                age: 0,
                city: 0,
                direction: 0,
                apartment_history: 0,
                rol: 0,
            });
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const deleteIncident = async (req, res, next) => {
    try {
        await Incident.findByIdAndDelete(req.params.id);
        res.json({ 'Delete Incidente': req.params.id });
    } catch (err) {
        next(createError(err));
    }
};

export const updateIncident = async (req, res, next) => {
    try {
        const resp = await Incident.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const newIncident = async (req, res, next) => {
    try {
        const result = await Incident.create(req.body);
        res.status(201);
        res.json(result);
    } catch (error) {
        next(createError(error));
    }
};
