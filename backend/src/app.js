import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Expertrouter from '../routes/ExpertsRoute.js';
import BookingRouter from '../routes/BookingsRoute.js';
const app = express();
const port = process.env.port;
app.use(cors());
app.use(express.json());
app.use('/experts',Expertrouter);
app.use('/bookings',BookingRouter);
export default app;

