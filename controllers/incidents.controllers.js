import { mongoConnect } from '../services/connection';
import { Incident } from '../models/incident.model.js';
import { createError } from '../services/create-error';

export const getAllIncidents = async (req, res, next) => {
    await mongoConnect();
    try {
        const resp = await Incident.find({});
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const getIncidents = async (req, res, next) => {
    try {
        const resp = await Incident.findById(req.params.id);
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
