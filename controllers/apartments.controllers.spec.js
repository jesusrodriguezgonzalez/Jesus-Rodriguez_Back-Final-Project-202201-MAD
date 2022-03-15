import mongoose from 'mongoose';
import { server } from '../index.js';
import { Apartment } from '../models/apartment.models.js';
import {
    getAllApartments,
    getApartment,
    deleteApartment,
    updateApartment,
    newApartment,
} from './apartments.controllers.js';

jest.mock('../models/apartment.models.js');
describe(' Given APARTMENTS controllers', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: {} };
        res = {};
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });
    afterAll(async () => {
        server.close();
        await mongoose.disconnect();
    });

    const mockApartment = {
        direction: 'New Direction',
        cp: '28010',
        province: 'Madrid',
    };
    describe('Testing  getAllapartments() ', () => {
        test('should return correct mockResolvedValue', async () => {
            Apartment.find.mockResolvedValue([mockApartment]);
            await getAllApartments(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([
                {
                    direction: 'New Direction',
                    cp: '28010',
                    province: 'Madrid',
                },
            ]);
        });
        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.find.mockRejectedValue('Test error');
                await getAllApartments(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('Testing getApartment()', () => {
        beforeEach(() => {
            Apartment.findById.mockReturnValue({
                populate: () => ({
                    populate: () => [
                        {
                            direction: 'New Direction',
                            cp: '28010',
                            province: 'Madrid',
                        },
                    ],
                }),
            });
        });

        test('Then call json', async () => {
            await getApartment(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.findById.mockResolvedValue({
                    populate: () => ({
                        populate: () => {
                            throw new Error('Test error');
                        },
                    }),
                });
                await getApartment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('Testing deleteApartment()', () => {
        beforeEach(() => {
            Apartment.findByIdAndDelete.mockResolvedValue([
                {
                    'Delete Incident': 12,
                },
            ]);
        });

        test('Then call json', async () => {
            await deleteApartment(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.findByIdAndDelete.mockRejectedValue('Test error');
                await deleteApartment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('Testing updateApartment()', () => {
        beforeEach(() => {
            Apartment.findByIdAndUpdate.mockResolvedValue([
                {
                    mockApartment,
                },
            ]);
        });

        test('Then call json', async () => {
            await updateApartment(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.findByIdAndUpdate.mockRejectedValue('Test error');
                await updateApartment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('Testing  newIncident ', () => {
        test('should return correct mockResolvedValue', async () => {
            Apartment.create.mockResolvedValue([mockApartment]);

            await newApartment(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([
                {
                    direction: 'New Direction',
                    cp: '28010',
                    province: 'Madrid',
                },
            ]);
        });
        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.create.mockRejectedValue('Test error');
                await newApartment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
