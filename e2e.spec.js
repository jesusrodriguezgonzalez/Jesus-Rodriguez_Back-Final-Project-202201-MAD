import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from './index';

const fakeToke =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzA0ZGM5NTc2MjIyNGY0Yjc5NmQ5OCIsImlhdCI6MTY0NzM0MTkzMX0.szU316AbVuyZhz8x2yH-DNQ5IRX5-fcyxuuTGuLJw0Y';

describe('Given app', () => {
    afterAll(() => {
        mongoose.disconnect();
        server.close();
    });

    describe('When GET /users', () => {
        test('It returns status 200', async () => {
            const response = await request(app)
                .get('/users')
                .set('Authorization', 'bearer ' + fakeToke);
            expect(response.status).toBe(200);
        });
    });
    describe('When GET /incidents', () => {
        test('It returns status 200', async () => {
            const response = await request(app)
                .get('/apartments')
                .set('Authorization', 'bearer ' + fakeToke);
            expect(response.status).toBe(200);
        });
    });
    describe('When GET /apartments', () => {
        test('It returns status 200', async () => {
            const response = await request(app)
                .get('/incidents')
                .set('Authorization', 'bearer ' + fakeToke);

            expect(response.status).toBe(200);
        });
    });
});
