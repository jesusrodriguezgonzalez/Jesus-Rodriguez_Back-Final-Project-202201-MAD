import { mongoConnect } from '../services/connection.js';
import { createError } from '../services/create-error.js';
import { Apartment } from '../models/apartment.models.js';
import { User } from '../models/user.models.js';
import { errUpdateRenter } from '../utils/errors.js';
import { Contract } from '../models/contracts.js';

export const getAllApartments = async (req, res, next) => {
    const { id } = req.tokenPayload;

    await mongoConnect();
    try {
        const resp = await Apartment.find({ owner: id });
        res.status(200).json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const getApartment = async (req, res, next) => {
    try {
        const resp = await Apartment.findById(req.params.id)
            .populate('current_tenant', {
                id: 1,
                email: 1,
                name: 1,
                surname: 1,
                image: 1,
                phone: 1,
            })
            .populate('owner', {
                id: 1,
                email: 1,
                name: 1,
                surname: 1,
                image: 1,
                phone: 1,
            })
            .populate('current_contract')
            .populate('incidents', {});
        res.status(200);
        res.json(resp);
    } catch (err) {
        next(createError(err));
    }
};

export const deleteApartment = async (req, res, next) => {
    try {
        await Apartment.findByIdAndDelete(req.params.id);
        res.status(202);
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
        res.status(200);
    } catch (err) {
        next(createError(err));
    }
};

export const newApartment = async (req, res, next) => {
    const { owner } = req.body;
    try {
        const result = await Apartment.create(req.body);

        const { id } = result;
        const userOwner = await User.findById(owner);
        userOwner.apartments_owner.push(id);
        await userOwner.save();
        res.status(201);
        res.json(result);
    } catch (error) {
        next(createError(error));
    }
};

export const addTenat = async (req, res, next) => {
    const idApartment = req.params.id;
    const { email, user_owner, start_date, end_date, document, fee } = req.body;
    if (email) {
        try {
            const userTenant = await User.findOne({ email });
            const resp = await Apartment.findByIdAndUpdate(
                idApartment,
                { current_tenant: userTenant.id, status: 'Alquilada' },
                {
                    new: true,
                }
            );
            userTenant.current_apartment = idApartment;
            await userTenant.save();
            const contract = await Contract.create({
                user_owner,
                user_tenant: userTenant.id,
                start_date,
                end_date,
                id_apartment: idApartment,
                document,
                fee,
            });
            userTenant.current_contract = contract.id;
            await userTenant.save();
            (resp.current_contract = contract.id), await resp.save();

            res.json({ apartment: resp, contract: contract });
            res.status(200);
        } catch (err) {
            next(createError(err));
        }
    } else {
        next(errUpdateRenter);
    }
};
