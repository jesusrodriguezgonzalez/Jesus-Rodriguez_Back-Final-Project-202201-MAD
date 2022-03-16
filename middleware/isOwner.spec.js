import { Apartment } from '../models/apartment.models.js';
import { verifyToken } from '../services/auth.js';
import { isOwner } from './isOwner.js';
jest.mock('../services/auth.js');
jest.mock('../models/apartment.models.js');
describe('Given a route intercepted by isOwner', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: '12345' };
        res = {};
        req.get = jest.fn();
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    const mockApartment = {
        direction: 'New Direction',
        cp: '28010',
        province: 'Madrid',
        owner: '12345',
    };

    describe('when i call with a valid id', () => {
        test('Then call next ', async () => {
            Apartment.findById.mockResolvedValue(mockApartment);
            req.get.mockReturnValue('bearer token');
            verifyToken.mockReturnValue({ id: '12345' });
            await isOwner(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('when i call with an invalid id', () => {
        test('Then call next with error', async () => {
            Apartment.findById.mockResolvedValue(mockApartment);
            req.get.mockReturnValue('bearer token');
            verifyToken.mockReturnValue({ id: '1' });
            await isOwner(req, res, next);
            expect(next).toHaveBeenCalledWith({
                message: 'Unauthorized',
                name: 'Unauthorized',
                status: '401',
            });
        });
    });
});
