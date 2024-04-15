import express, { Request, Response } from 'express';
import { loginUserHandler, registerUserHandler } from '../controllers/controllers';

const router = express.Router();

// Endpoint for logging in the user in the application
router.post('/login', loginUserHandler);
// Endpoint for registering tge user inside of the application
router.post('/register', registerUserHandler);

export default router;
