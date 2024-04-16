import express, { Request, Response } from 'express';
import { loginUserHandler, registerUserHandler, verifiedUser } from '../controllers/controllers';
import sendAndSaveOTP from '../middlewares/sendAndSaveOTP'
import verifyOTP from '../middlewares/verifyOTP';

const router = express.Router();

// Endpoint for logging in the user in the application
router.post('/login', loginUserHandler);
// Endpoint for registering tge user inside of the application
router.post('/register', sendAndSaveOTP, registerUserHandler);
// endpoint for verifing the otp of the user in the application
router.post(`/verify/:userID`, verifyOTP, verifiedUser);

export default router;
