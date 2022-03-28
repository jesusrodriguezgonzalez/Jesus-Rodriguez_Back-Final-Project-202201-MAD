import mongoose from 'mongoose';
import { server } from '../index.js';
import { Apartment } from '../models/apartment.models.js';
import { User } from '../models/user.models.js';
import {
    getAllApartments,
    getApartment,
    deleteApartment,
    updateApartment,
    newApartment,
    addTenat,
} from './apartments.controllers.js';
import { userMockOK } from '../utils/mock.js';

jest.mock('../services/connection.js');
jest.mock('../models/apartment.models.js');
jest.mock('../models/user.models.js');
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
        id: '1234567',
        direction: 'New Direction',
        cp: '28010',
        province: 'Madrid',
        owner: '12345',
    };

    describe('Testing  getAllapartments() ', () => {
        test('should return correct mockResolvedValue', async () => {
            req.tokenPayload = { id: '1234' };
            Apartment.find.mockResolvedValue([mockApartment]);
            await getAllApartments(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([mockApartment]);
        });
        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                req.tokenPayload = { id: '1234' };

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
                            owner: '12345',
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

    describe('Testing  newaApartments ', () => {
        test('should return correct mockResolvedValue', async () => {
            req.body = mockApartment;
            Apartment.create.mockResolvedValue(mockApartment);
            User.findById.mockResolvedValue({
                owner: '62304dc95762224f4b796d98',
                save: jest.fn(),
            });

            await newApartment(req, res, next);
            console.log(res.json, 'JSON');
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                id: '1234567',
                direction: 'New Direction',
                cp: '28010',
                province: 'Madrid',
                owner: '12345',
            });
        });
        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                req.body = mockApartment;

                Apartment.create.mockRejectedValue('Test error');
                await newApartment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('Testing addTenat()', () => {
        beforeEach(() => {
            Apartment.findByIdAndUpdate.mockResolvedValue([
                {
                    mockApartment,
                },
            ]);
            req = {
                body: { email: 'jesus@gmail.com' },
                params: { id: '12345' },
            };
            User.findOne.mockResolvedValue({
                email: 'jesus@gmail.com',
                save: jest.fn(),
            });
        });

        test('Then call json', async () => {
            await addTenat(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.findByIdAndUpdate.mockRejectedValue('Test error');
                await addTenat(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
