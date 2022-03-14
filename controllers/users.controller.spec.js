import {
    getAllUsers,
    registerUser,
    login,
    updateUser,
} from '../controllers/users.controllers.js';
import { User } from '../models/user.models.js';
import { createToken } from '../services/auth';
import bcrypt from 'bcryptjs';

jest.mock('../models/user.models.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');

describe("Given USERS controllers' ", () => {
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
        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                User.find.mockRejectedValue('Test error');
                await getAllUsers(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('Testing registerUser', () => {
        const userMock = {
            email: 'Jesus@gmail.com',
            passwd: '12345',
        };
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                req.body = { email: 'Jesus@gmail.com', passwd: '1234' };
                bcrypt.hashSync.mockResolvedValue('encrypted1234');
                User.mockReturnValue({
                    email: 'Jesus@gmail.com',
                    passwd: 'encrypted1234',
                    id: 1,
                });
            });
            test('Then call json', async () => {
                User.create.mockResolvedValue(userMock);
                await registerUser(req, res, next);
                await expect(res.json).toHaveBeenCalledWith({
                    email: 'Jesus@gmail.com',
                    passwd: '12345',
                });
            });

            describe('And it not works (promise is rejected)', () => {
                test('Then call next', async () => {
                    User.create.mockRejectedValue('Test error');
                    await registerUser(req, res, next);
                    expect(next).toHaveBeenCalled();
                });
            });
        });
    });
    describe('Testing Login', () => {
        describe('When loginUser is triggered', () => {
            describe('And there are not user name ', () => {
                test('Then call next', async () => {
                    req.body = { email: 'jesus@gmail.com' };
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

    describe('Testing updateUser()', () => {
        beforeEach(() => {
            User.findByIdAndUpdate.mockResolvedValue([
                {
                    name: 'jesus',
                    age: 28,
                    surname: 'rodriguez',
                },
            ]);
        });

        test('Then call json', async () => {
            await updateUser(req, res, next);
            expect(res.json).toHaveBeenCalled();
        });

        describe('And it not works (promise is rejected)', () => {
            test('Then call next', async () => {
                User.findByIdAndUpdate.mockRejectedValue('Test error');
                await getAllUsers(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
