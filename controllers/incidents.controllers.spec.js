import { Incident } from '../models/incident.model.js';
import {
    getAllIncidents,
    getIncidents,
    deleteIncident,
    updateIncident,
} from './incidents.controllers';

jest.mock('../models/incident.model.js');
describe(' Given INCIDENTS controllers', () => {
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

    const mockIncidents = {
        title: 'New Incidents',
        status: 'Open',
        priority: 'High',
    };
    describe('Testing  getAllIncidents ', () => {
        test('should return correct mockResolvedValue', async () => {
            Incident.find.mockResolvedValue([mockIncidents]);

            await getAllIncidents(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([
                {
                    title: 'New Incidents',
                    status: 'Open',
                    priority: 'High',
                },
            ]);
        });
        test('should return correct mockRejectedValue', async () => {
            Incident.find.mockRejectedValue('Test error');
            try {
                await getAllIncidents();
            } catch (e) {
                expect(e).toEqual(new Error('Test error'));
            }
        });
    });

    describe('Testing getIncidents()', () => {
        beforeEach(() => {
            Incident.findById.mockResolvedValue([
                {
                    name: 'jesus',
                    age: 28,
                    surname: 'rodriguez',
                },
            ]);
        });

        test('Then call json', async () => {
            await getIncidents(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        test('should return correct mockRejectedValue', async () => {
            Incident.findById.mockRejectedValue('Test error');
            try {
                await getAllIncidents();
            } catch (e) {
                expect(e).toEqual(new Error('Test error'));
            }
        });
    });

    describe('Testing deleteIncident()', () => {
        beforeEach(() => {
            Incident.findByIdAndDelete.mockResolvedValue([
                {
                    'Delete Incident': 12,
                },
            ]);
        });

        test('Then call json', async () => {
            await deleteIncident(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        // test('should return correct mockRejectedValue', async () => {
        //     Incident.findById.mockRejectedValue('Test error');
        //     try {
        //         await deleteIncident();
        //     } catch (e) {
        //         expect(e).toEqual(new Error('Test error'));
        //     }
        // });
    });

    describe('Testing updateIncident()', () => {
        beforeEach(() => {
            Incident.findByIdAndUpdate.mockResolvedValue([
                {
                    mockIncidents,
                },
            ]);
        });

        test('Then call json', async () => {
            await updateIncident(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                Incident.findByIdAndUpdate.mockRejectedValue('Test error');
                await updateIncident(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
