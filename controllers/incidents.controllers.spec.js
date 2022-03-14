import { Incident } from '../models/incident.model.js';
import { getAllIncidents, getIncidents } from './incidents.controllers';

jest.mock('../models/incident.model.js');
describe('Name of the group', () => {
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
});
