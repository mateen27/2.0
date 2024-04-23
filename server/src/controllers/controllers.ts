import { Request, Response } from "express";
import User from "../models/userModel";
import {
  acceptFriendRequest,
  fetchFollowers,
  fetchFollowing,
  fetchFriendRequests,
  fetchUserFollowersHandler,
  fetchUserFollowingHandler,
  findUserByEmailAndPassword,
  generateToken,
  isAlreadyRegistered,
  listAllUsersExceptLoggedIn,
  registerToDatabase,
  updateFriendRequests,
  updateSentFriendRequests,
} from "../services/authService";

// logic for signing the user inside of the application
const loginUserHandler = async (req: Request, res: Response) => {
  try {
    // accessing the input values which user provided in the front-end
    const { email, password } = req.body;

    // check if the email and password are provided or not!
    if (
      email === undefined ||
      password === undefined ||
      !email ||
      !password ||
      email === "" ||
      password === ""
    ) {
      return res.status(400).json({
        status: 400,
        message: "Please provide email and password",
      });
    }

    // checking if the user is authenticated in database or not!
    const user = await findUserByEmailAndPassword(email, password);

    // is user is not found in the database
    if (user === null || user === undefined) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // when the user is found inside the database
    if (user) {
      // user is found
      // generating the token for the user
      const token = await generateToken(user._id);

      if (token) {
        // token is generated
        return res.status(200).json({
          user,
          token,
        });
      } else {
        // token is not generated
        return res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    } else {
      // user not found or invalid credentials
      return res.status(404).json({
        status: 404,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error during login!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for registering the user inside of the application
const registerUserHandler = async (req: Request, res: Response) => {
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
};

// logic for sending the user has been verified into the database
// Endpoint for handling verified user
const verifiedUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for fetching all the users of the application except the logged in user & sent friendRequest and in friendRequest person
const fetchAllUsersHandler = async (req: Request, res: Response) => {
  try {
    // accessing the logged in user's profile
    const loggedInUser = req.params.userID;

    // Making the query in the database where _id does not include the loggedInUserId
    const users = await listAllUsersExceptLoggedIn(loggedInUser);

    res.status(200).json({ users });
  } catch (error) {
    console.log("Error fetching the users:", error);
    res.status(500).json({ message: "Error fetching all the users!" });
  }
};

// logic for sending friend requests to the person!
const sendFriendRequestHandler = async (req: Request, res: Response) => {
  try {
    // recepient user ID
    const { selectedUserId } = req.body;
    // current user ID
    const { userID } = req.params;

    // update the sender's sentFriendRequest [add recipientId to their friend requests sent list]
    const senderResponse: any = await updateSentFriendRequests(
      userID,
      selectedUserId
    );

    // update the recipient's sentFriendRequest [add senderId to their friend requests sent list]
    const recipientResponse: any = await updateFriendRequests(
      selectedUserId,
      userID
    );

    // return the response
    res.status(200).json({ senderResponse, recipientResponse });
  } catch (error) {
    console.log("error sending friend request");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for viewing all the friend requests of the current user
const viewFriendRequestHandler = async (req: Request, res: Response) => {
  try {
    // accessing the logged in user's profile ID
    const { userID } = req.params;

    const users = await fetchFriendRequests(userID);
    res.status(200).json({ users });
  } catch (error) {
    console.log("error fetching the friend requests of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for accepting the friend-request of the user
const acceptFriendRequestHandler = async (req: Request, res: Response) => {
  try {
    // accesing the userID and the recipient ID of the user
    const { userID, recepientID } = req.body;

    // redirecting to the services file
    await acceptFriendRequest(userID, recepientID);

    // send the reponse back to the client
    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.log("error accepting the friend request of the user", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// logic for displaying all the followers of the logged in user
const viewFollowersHandler = async (req: Request, res: Response) => {
  try {
    // accesing userID from the params
    const { userID } = req.params;

    // finding if the user the user exists or not
    const user = await fetchFollowers(userID);

    const followers = user?.followers;

    res.status(200).json(followers);
  } catch (error) {
    console.log("error fetching the followers of the user", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logic for displaying all the followings of the user
const viewFollowingsHandler = async ( req: Request, res: Response ) => {
    try {
        // accessing the userID
        const { userID } = req.params;

        // finding if the user the user exists or not
        const user = await fetchFollowing(userID);

        // accesianing the following of the user
        const following = user?.following;

        // returning the response
        res.status(200).json(following);
    } catch (error) {
        console.log("error fetching the followers of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// logic for displaying the followers of the specific user
const fetchFollowersHandler = async ( req: Request, res: Response ) => {
    try {
        const { userID } = req.body;

        // finding if the user exists or not 
        const user = await fetchUserFollowersHandler(userID);

        const followers = user?.followers;

        res.status(200).json(followers);
    } catch (error) {
        console.log("error fetching the followers of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// logic for displaying the following of the user of the specified user
const fetchFollowingHandler = async ( req: Request, res: Response ) => {
    try {
        // accessing the userID from the body
        const { userID } = req.body;

        // finding if the user exists or not
        const user = await fetchUserFollowingHandler(userID);

        // accessing the following of the user
        const following = user?.following;

        res.status(200).json(following);
    } catch (error) {
        console.log("error fetching the following of the user", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
  loginUserHandler,
  registerUserHandler,
  verifiedUser,
  fetchAllUsersHandler,
  sendFriendRequestHandler,
  viewFriendRequestHandler,
  acceptFriendRequestHandler,
  viewFollowersHandler,
  viewFollowingsHandler,
  fetchFollowersHandler,
  fetchFollowingHandler
};
