import { getAllUsers } from '../controllers/users.controllers.js';
import { User } from '../models/user.models.js';
import { mockRequest, mockResponse } from '../utils/interceptos';

jest.mock('../models/user.models.js');

describe("Given controllers' ", () => {
    describe('When getAllUsers receives data without errors', () => {
        test('should return correct mockResolvedValue', async () => {
            User.find.mockResolvedValue([
                {
                    name: 'jesus',
                    age: 28,
                    surname: 'rodriguez',
                },
            ]);

            let req = mockRequest();
            const res = mockResponse();

            await getAllUsers(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith([
                {
                    name: 'jesus',
                    age: 28,
                    surname: 'rodriguez',
                },
            ]);
        });
    });
    describe('When getAllUsers throws an error', () => {
        beforeEach(() => {
            User.find.mockRejectedValue('Test error');
        });
        test('should return correct mockRejectedValue', async () => {
            try {
                await getAllUsers();
            } catch (e) {
                expect(e).toEqual(new Error('Test error'));
            }
        });
    });
});
