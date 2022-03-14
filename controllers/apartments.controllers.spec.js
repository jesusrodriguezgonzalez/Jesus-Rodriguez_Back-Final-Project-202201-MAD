import { Apartment } from '../models/apartment.models.js';
import { getAllApartments, getApartment } from './apartments.controllers.js';

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

    const mockApartment = {
        direction: 'New Direction',
        cp: '28010',
        province: 'Madrid',
    };
    describe('Testing  getApartment ', () => {
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
            Apartment.findById.mockResolvedValue([
                {
                    direction: 'New Direction',
                    cp: '28010',
                    province: 'Madrid',
                },
            ]);
        });

        test('Then call json', async () => {
            await getApartment(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Apartment.findById.mockRejectedValue('Test error');
                await getApartment(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
