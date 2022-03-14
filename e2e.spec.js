import mongoose from 'mongoose';
import request from 'supertest';
import { app, server } from './index';

describe('Given app', () => {
    afterAll(() => {
        mongoose.disconnect();
        server.close();
    });
    describe('When GET /users', () => {
        test('It returns status 200', async () => {
            const response = await request(app).get('/users');
            expect(response.status).toBe(200);
        });
    });
    describe('When GET /incidents', () => {
        test('It returns status 200', async () => {
            const response = await request(app).get('/apartments');
            expect(response.status).toBe(200);
        });
    });
    describe('When GET /apartments', () => {
        test('It returns status 200', async () => {
            const response = await request(app).get('/incidents');
            expect(response.status).toBe(200);
        });
    });
});
