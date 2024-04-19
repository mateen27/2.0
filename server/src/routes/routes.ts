import express, { Request, Response } from 'express';
import { fetchAllUsersHandler, loginUserHandler, registerUserHandler, sendFriendRequestHandler, verifiedUser } from '../controllers/controllers';
import sendAndSaveOTP from '../middlewares/sendAndSaveOTP'
import verifyOTP from '../middlewares/verifyOTP';

const router = express.Router();

// Endpoint for logging in the user in the application
router.post('/login', loginUserHandler);
// Endpoint for registering tge user inside of the application
router.post('/register', sendAndSaveOTP, registerUserHandler);
// endpoint for verifing the otp of the user in the application
router.post(`/verify/:userID`, verifyOTP, verifiedUser);
// endpoint for fetching all the users in the application except the logged in user
router.get('/fetchAllUsers/:userID', fetchAllUsersHandler);
// endpoint for sending friend-requests to the person
router.post('/friendRequests/:userID', sendFriendRequestHandler);

export default router;
