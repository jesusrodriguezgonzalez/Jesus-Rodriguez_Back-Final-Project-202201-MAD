import {
    getAllUsers,
    registerUser,
    login,
} from '../controllers/users.controllers.js';
import { User } from '../models/user.models.js';
import { mockRequest, mockResponse } from '../utils/interceptos';
import { createToken, verifyToken } from '../services/auth';
import bcrypt from 'bcryptjs';

jest.mock('../models/user.models.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');

describe("Given controllers' ", () => {
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
    describe('Testing Login', () => {
        describe('When loginUser is triggered', () => {
            describe('And there are not user name ', () => {
                test('Then call next', async () => {
                    req.body = { name: 'Jesus' };
                    await login(req, res, next);
                    expect(res.json).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalled();
                });
            });
            describe('And there are not password', () => {
                test('Then call next ', async () => {
                    req.body = { passwd: '1234' };
                    await login(req, res, next);
                    expect(res.json).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalled();
                });
            });

            describe('And there are user name or password', () => {
                beforeEach(() => {
                    req.body = { email: 'Jesus@gmail.com', passwd: '123' };
                });

                describe('And the user name is not found', () => {
                    test('Then call next', async () => {
                        User.findOne.mockResolvedValue(null);
                        await login(req, res, next);
                        expect(next).toHaveBeenCalled();
                    });
                });

                describe('And the password is no correct', () => {
                    test('Then call next', async () => {
                        User.findOne.mockResolvedValue({});
                        bcrypt.compareSync.mockReturnValue(false);
                        await login(req, res, next);
                        expect(next).toHaveBeenCalled();
                    });
                });

                describe('And the user name and password are ok', () => {
                    test('Then call send', async () => {
                        const userMock = {
                            email: 'Jesus@gmail.com',
                            id: '123',
                            passwd: '12345',
                            image: 'imageString',
                        };
                        req.body = userMock;
                        User.findOne.mockResolvedValue(userMock);
                        bcrypt.compareSync.mockReturnValue(true);
                        createToken.mockReturnValue('mock_token');
                        console.log(req.body);
                        await login(req, res, next);
                        await expect(res.json).toHaveBeenCalledWith({
                            token: 'mock_token',
                            email: 'Jesus@gmail.com',
                            id: '123',
                            image: 'imageString',
                        });
                    });
                });
            });
        });
    });
});
