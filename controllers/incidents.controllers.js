import { mongoConnect } from '../services/connection.js';
import { Incident } from '../models/incident.model.js';
import { createError } from '../services/create-error.js';
import { Apartment } from '../models/apartment.models.js';

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
        res.status(202);
        res.json({ 'Deleted Incident': req.params.id });
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
    console.log(req.body);
    try {
        const result = await Incident.create(req.body);
        const { id, id_apartment } = result;
        const idIncidents = id.toString();
        const apartment = await Apartment.findById(id_apartment);
        apartment.incidents.push(idIncidents);
        await apartment.save();
        res.status(201).json(result);
    } catch (error) {
        next(createError(error));
    }
};
