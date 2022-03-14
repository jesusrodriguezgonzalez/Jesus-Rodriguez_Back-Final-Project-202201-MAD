import { getAllUsers, registerUser } from '../controllers/users.controllers.js';
import { User } from '../models/user.models.js';
import { mockRequest, mockResponse } from '../utils/interceptos';
import bcrypt from 'bcryptjs';

jest.mock('../models/user.models.js');
jest.mock('bcryptjs');

describe("Given controllers' ", () => {
    describe('Testing  getAllUsers ', () => {
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
        test('should return correct mockRejectedValue', async () => {
            User.find.mockRejectedValue('Test error');
            try {
                await getAllUsers();
            } catch (e) {
                expect(e).toEqual(new Error('Test error'));
            }
        });
    });

    describe('Testing registerUser', () => {
        let req = mockRequest();
        const res = mockResponse();
        let next = jest.fn();
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                req.body = { name: 'Jesus', passwd: '1234' };
                bcrypt.hashSync.mockResolvedValue('encrypted1234');
                User.mockReturnValue({
                    name: 'Jesus',
                    passwd: 'encrypted1234',
                    id: 1,
                });
            });
            test('Then call json', async () => {
                const userMock = {
                    name: 'Jesus',
                    passwd: '12345',
                };
                User.create.mockResolvedValue(userMock);
                await registerUser(req, res, next);
                await expect(res.json).toHaveBeenCalledWith({
                    name: 'Jesus',
                    passwd: '12345',
                });
            });
        });
    });
});
