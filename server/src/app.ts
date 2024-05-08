import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDatabase from './config/database'
import router from './routes/routes';

// http
import http from 'http';
// socket
import { Server as SocketIOServer } from 'socket.io';

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

// making the server using http
const server = http.createServer(app) // app instance of express
// socket io server
const io = new SocketIOServer(server);

// socket io logics
io.on('connection', (socket) => {
  // console.log('A user connected');

  socket.on('pause', () => {
    io.emit('pause');
  });

  socket.on('resume', () => {
    io.emit('resume');
  });

  socket.on('disconnect', () => {
    // console.log('A user disconnected');
    io.emit('disconnected')
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
