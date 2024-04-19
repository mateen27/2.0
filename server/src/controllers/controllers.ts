import { Request , Response } from "express"
import User from "../models/userModel";
import { findUserByEmailAndPassword, generateToken, isAlreadyRegistered, listAllUsersExceptLoggedIn, registerToDatabase, updateSentFriendRequests } from "../services/authService";

// logic for signing the user inside of the application
const loginUserHandler = async ( req: Request , res: Response ) => {
    try {
        // accessing the input values which user provided in the front-end
        const { email , password } = req.body;

        // check if the email and password are provided or not!
        if ( email === undefined || password === undefined || !email || !password || email === "" || password === "" ) {
            return res.status(400).json({
                status: 400,
                message: "Please provide email and password"
            })
        }

        // checking if the user is authenticated in database or not!
        const user = await findUserByEmailAndPassword(email, password);

        // is user is not found in the database
        if ( user === null || user === undefined ) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        }

        // when the user is found inside the database
        if ( user ) {
            // user is found 
            // generating the token for the user
            const token = await generateToken(user._id);

            if ( token ) {
                // token is generated
                return res.status(200).json({
                    user,
                    token
                })
            }
            else {
                // token is not generated
                return res.status(500).json({
                    status: 500,
                    message: "Internal server error"
                })
            }
        }
        else {
            // user not found or invalid credentials
            return res.status(404).json({
                status: 404,
                message: "Invalid email or password"
            })
        }

    } catch (error) {
        console.error("Error during login!", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// logic for registering the user inside of the application
const registerUserHandler = async ( req: Request , res: Response ) => {
    try {
        // try accessing the details of the user
        const { email } = req.body;

        // Calling a function in the service to handle database operations!
        const user = await isAlreadyRegistered(email);

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error Registering the user!", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// logic for sending the user has been verified into the database
// Endpoint for handling verified user
const verifiedUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// logic for fetching all the users of the application except the logged in user & sent friendRequest and in friendRequest person
const fetchAllUsersHandler = async (req: Request, res: Response) => {
    try {
        // accessing the logged in user's profile
        const loggedInUser = req.params.userID;

        // Making the query in the database where _id does not include the loggedInUserId
        const users = await listAllUsersExceptLoggedIn(loggedInUser);

        res.status(200).json( {users} );
    } catch (error) {
        console.log('Error fetching the users:' , error);
        res.status(500).json({ message: 'Error fetching all the users!' });
    }
};

// logic for sending friend requests to the person!
const sendFriendRequestHandler = async( req: Request, res: Response ) => {
    try {
        // recepient user ID 
        const { selectedUserId } = req.body;
        // current user ID
        const { userID } = req.params; 

        // update the sender's sentFriendRequest [add recipientId to their friend requests sent list]
        await updateSentFriendRequests(userID, selectedUserId);
    } catch (error) {
        console.log('error sending friend request');
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { loginUserHandler, registerUserHandler, verifiedUser, fetchAllUsersHandler, sendFriendRequestHandler };