import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import { mongoConnect } from './services/connection.js';

export const app = express();
const port = process.env.PORT;

import usersRouter from './routes/users.route.js';
import apartmentsRoute from './routes/apartments.route.js';
import incidentsROute from './routes/incidents.route.js';

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

mongoConnect();
app.use('/users', usersRouter);
app.use('/apartments', apartmentsRoute);
app.use('/incidents', incidentsROute);

usersRouter.all('*', cors());
apartmentsRoute.all('*', cors());
incidentsROute.all('*', cors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, resp, next) => {
    console.log(err.message);
    resp.status(err.status);
    resp.send({ error: err.message });
});

export const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
