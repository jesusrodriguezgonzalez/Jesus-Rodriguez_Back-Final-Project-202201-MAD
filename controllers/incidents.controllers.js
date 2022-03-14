import { mongoConnect } from '../services/connection';
import { Incident } from '../models/incident.model.js';

export const getAllIncidents = async (req, res) => {
    await mongoConnect();
    try {
        const resp = await Incident.find({});
        res.json(resp);
    } catch (err) {
        throw new Error(err);
    }
};

export const getIncidents = async (req, res) => {
    try {
        const resp = await Incident.findById(req.params.id);
        res.json(resp);
    } catch (err) {
        throw new Error(err);
    }
};
