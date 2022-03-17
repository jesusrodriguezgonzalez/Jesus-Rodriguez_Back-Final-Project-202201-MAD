import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from './index';
import * as mock from './utils/mock';
import { User } from './models/user.models.js';
import { Incident } from './models/incident.model.js';
import { Apartment } from './models/apartment.models.js';
const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzA0ZGM5NTc2MjIyNGY0Yjc5NmQ5OCIsImlhdCI6MTY0NzM3NzY5NH0.KfR5gpq03jpzF0MErkiXVTYc8Q7nba4HIUj3l96NXyE';

describe('Given app', () => {
    afterAll(() => {
        mongoose.disconnect();
        server.close();
    });
    beforeAll(async () => {
        await User.deleteMany({});
        await Apartment.deleteMany({});
        await Incident.deleteMany({});
    });

    let id;
    let tokenUser;
    let idPatchApartments;
    let idIncident;

    describe('TESTING USERS NODE', () => {
        describe('When GET /users', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .get('/users')
                    .set('Authorization', 'bearer ' + token);
                expect(response.status).toBe(200);
            });
        });
        describe('When POST /users/register', () => {
            test('It returns status 201', async () => {
                const resp = await request(app)
                    .post('/users/register')
                    .send(mock.userMockOK);
                id = resp.body._id;
                expect(resp.status).toBe(201);
            });
            describe('User creation requires the fields email, name and password', () => {
                test('It returns status 500', async () => {
                    const resp = await request(app)
                        .post('/users/register')
                        .send({ email: 'pepe@gmail.com', name: 'pepe' });
                    expect(resp.status).toBe(400);
                });
            });
        });
        describe('When POST /users/login', () => {
            test('It returns status 201', async () => {
                const resp = await request(app)
                    .post('/users/login')
                    .send({ email: 'jesus@gmail.com ', passwd: '12345' });
                tokenUser = resp.body.token;
                expect(resp.status).toBe(200);
            });
            test('If the user or password is wrong, It returns status 401', async () => {
                const resp = await request(app)
                    .post('/users/login')
                    .send({ email: 'jesus@gmail.com ', passwd: '1234' });
                expect(resp.status).toBe(401);
                expect(resp.body.error).toBe('User or password invalid');
            });
        });
        describe('When PATCH /users with invalid path', () => {
            test('It returns status 500', async () => {
                const response = await request(app)
                    .patch('/users/1234')
                    .set('Authorization', 'bearer ' + tokenUser);
                expect(response.status).toBe(500);
            });
        });
    });

    describe('TESTING INCIDENT NODE', () => {
        describe('When GET /incidents', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .get('/apartments')
                    .set('Authorization', 'bearer ' + tokenUser);
                expect(response.status).toBe(200);
            });
        });
        describe('When POST /incidents', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .post('/incidents')
                    .set('Authorization', 'bearer ' + tokenUser)
                    .send({
                        title: 'New incidents',
                        type_incidence: 'Break',
                        id_apartment: idPatchApartments,
                        id_user: id,
                    });
                idIncident = response.body._id;
                expect(response.status).toBe(201);
            });
        });
        describe('When DELETE /incidents', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .delete(`/incidents/${idIncident}`)
                    .set('Authorization', 'bearer ' + tokenUser);
                expect(response.status).toBe(200);
            });
        });
    });

    describe('TESTING APARTMENTS NODE', () => {
        beforeAll(async () => {
            await Apartment.deleteMany({});
        });

        describe('When POST /apartments', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .post('/apartments')
                    .set('Authorization', 'bearer ' + token)
                    .send({
                        direction: 'C/Vallehermoso,110',
                        cp: '28010',
                        province: 'Madrid',
                        current_user: '62304dc95762224f4b796d98',
                        status: 'Leased',
                        photos: [],
                        owner: id,
                    });
                idPatchApartments = response.body._id;
                expect(response.status).toBe(201);
            });
        });
        describe('When GET /apartments', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .get('/incidents')
                    .set('Authorization', 'bearer ' + token);
                expect(response.status).toBe(200);
            });
        });
        describe('When PATCH /apartments', () => {
            test('It returns status 200', async () => {
                const response = await request(app)
                    .patch(`/apartments/${idPatchApartments}`)
                    .set('Authorization', 'bearer ' + tokenUser)
                    .send({ newProperty: 'new' });
                expect(response.status).toBe(200);
            });
        });
        describe('When PATCH /apartments with wrong authorization type', () => {
            test('It returns status 401', async () => {
                const response = await request(app)
                    .patch(`/apartments/${idPatchApartments}`)
                    .set('Authorization', 'camion ' + tokenUser)
                    .send({ newProperty: 'new' });
                expect(response.status).toBe(401);
                expect(response.body.error).toBe('token missing or invalid');
            });
        });
    });
});
