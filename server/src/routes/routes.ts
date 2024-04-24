import express, { Request, Response } from 'express';
import { acceptFriendRequestHandler, deletePostHandler, fetchAllUsersHandler, fetchFollowersHandler, fetchFollowingHandler, fetchPostsHandler, loginUserHandler, postHandler, registerUserHandler, sendFriendRequestHandler, updatePostDescriptionHandler, uploadPostHandler, userPostHandler, verifiedUser, viewFollowersHandler, viewFollowingsHandler, viewFriendRequestHandler } from '../controllers/controllers';
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
// endpoint for viewing friend-requests of the person
router.get('/friendRequests/:userID', viewFriendRequestHandler);
// endpoint for accepting the friend-requests of the user
router.post('/friend-request/accept', acceptFriendRequestHandler);
// endpoint to display all the followers of the current logged-in user
router.get('/followers/:userID', viewFollowersHandler);
// endpoint to display all the following of the current logged-in user
router.get('/followings/:userID', viewFollowingsHandler);
// endpoint to display all the followers of the normal user
router.get('/followers', fetchFollowersHandler);
// endpoint for displaying the following of the normal user
router.get('/following', fetchFollowingHandler);
// endpoint for uploading the post of the user
router.post('/upload-post/:userID', uploadPostHandler);
// endpoint for deleting the post 
router.delete('/delete-post/:userID', deletePostHandler);
// endpoint for updating the description of the user post
router.put('/update-post-description/:userID', updatePostDescriptionHandler);
// endpoint for fetching the posts for the user feed
router.get('/posts', postHandler);
// endpoint for fetching currently logged in user posts
router.get('/userPosts/:userID', userPostHandler);
// fetch normal user posts on profile visit
router.get('/fetchPosts/:userID', fetchPostsHandler);
// endpoint for liking the post
// endpoint for unliking the post
// endpoint for commenting on the post
// endpoint for uncommenting/deleting comment from the post



export default router;
