import { mongoConnect } from '../services/connection.js';
import * as dotenv from 'dotenv';
dotenv.config();

describe('first should check mongoConnect()', () => {
    test('should show my name DBNAME ', async () => {
        const connect = await mongoConnect();
        expect(connect.connections[0]).toHaveProperty('name', 'EHOME_TEST');
    });
});
