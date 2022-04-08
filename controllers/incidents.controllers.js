import { mongoConnect } from '../services/connection.js';
import { Incident } from '../models/incident.model.js';
import { createError } from '../services/create-error.js';
import { Apartment } from '../models/apartment.models.js';
import { Comment } from '../models/comments.model.js';

export const getAllIncidentsByApartment = async (req, res, next) => {
    console.log(req.params.id);

    const idApartment = req.params.id;
    await mongoConnect();
    try {
        const resp = await Incident.find({
            id_apartment: idApartment,
        })
            .populate('id_apartment', {
                current_tenant: 0,
                history_tenant: 0,
                status: 0,
                photos: 0,
                incidents: 0,
            })
            .populate('comments');

        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const getAllIncidents = async (req, res, next) => {
    try {
        const resp = await Incident.find({}).populate('comments');
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

export const addComment = async (req, res, next) => {
    const { user_id, text } = req.body;
    const id = req.params.id;
    const dataComment = {
        user_id,
        text,
        incident_id: id,
    };
    console.log(dataComment);
    try {
        const comment = await Comment.create(dataComment);
        const incident = await Incident.findById(id);
        incident.comments.push(comment._id);
        await incident.save();
        res.status(201).json(comment);
    } catch (error) {
        next(createError(error));
    }
};
