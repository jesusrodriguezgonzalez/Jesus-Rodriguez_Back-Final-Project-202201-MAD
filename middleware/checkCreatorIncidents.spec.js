import { Incident } from '../models/incident.model.js';
import { verifyToken } from '../services/auth.js';
import { checkCreatorIncidents } from './checkCreatorIncidents.js';
jest.mock('../services/auth.js');
jest.mock('../models/incident.model.js');
describe('Given a route intercepted by checkCreatorIncidents', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: '62304dc95762224f4b796d98' };
        res = {};
        req.get = jest.fn();
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    const mockIncident = {
        title: 'New incidents',
        type_incidence: 'Break',
        id_apartment: '623050d6664f29990e9b6d85',
        id_user: '62304dc95762224f4b796d98',
    };

    describe('when i call with a valid id', () => {
        test('Then call next', async () => {
            Incident.findById.mockResolvedValue(mockIncident);
            req.get.mockReturnValue('bearer token');
            verifyToken.mockReturnValue({ id: '62304dc95762224f4b796d98' });
            await checkCreatorIncidents(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('when i call with invalid id', () => {
        test('Then call next', async () => {
            Incident.findById.mockResolvedValue(mockIncident);
            req.get.mockReturnValue('bearer token');
            verifyToken.mockReturnValue({ id: 'invalidId' });
            await checkCreatorIncidents(req, res, next);
            expect(next).toHaveBeenCalledWith({
                message: 'Unauthorized',
                name: 'Unauthorized',
                status: '401',
            });
        });
    });

    describe('when i call with an invalid bearer authorization ', () => {
        test('Then call next with error', async () => {
            Incident.findById.mockResolvedValue(mockIncident);
            req.get.mockReturnValue('invalidadbearer');
            verifyToken.mockReturnValue({ id: '62304dc95762224f4b796d98' });
            await checkCreatorIncidents(req, res, next);
            expect(next).toHaveBeenCalledWith({
                message: 'token missing or invalid',
                status: '401',
                name: 'Unauthorized',
            });
        });
    });
});
