import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDatabase from './config/database'
import router from './routes/routes';
import path from 'path';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDatabase();

// routes
// sample route for checking the application is working or not!
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/user', router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
