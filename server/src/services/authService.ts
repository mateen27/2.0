import bcrypt from "bcryptjs";
// file holding all the logic part of the application.

import { UserInterface } from "./../models/userModel";
import User from "../models/userModel";
import Chat from "../models/chatModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Define the return type as Promise<UserInterface | null> since the function is async
const findUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserInterface | null> => {
  try {
    // logic to find the user by email and password
    const user = await User.findOne({
      email,
    });

    // if user is not found
    if (user === null || !user) {
      // no user is found
      return null;
    }

    // console.log('user is found',user);

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // // If passwords match, return the user
    if (isPasswordValid) {
      return user;
    } else {
      return null; // Return null indicating invalid password
    }
  } catch (error) {
    // Check if error is an instance of Error and has a message property
    if (error instanceof Error && error.message) {
      throw new Error("Error finding user: " + error.message);
    } else {
      // If error doesn't have a message property, just throw the original error
      throw error;
    }
  }
};

// function for generating the token for the user which is signing into the application
// creating a specific type/interface
type UserID = string | number;
const generateToken = async (userId: UserID): Promise<string | number> => {
  try {
    // accesing the secret key from .env file
    const secretKey = process.env.SECRET_KEY;
    // accesing the expires in from.env file
    const expiresIn = process.env.SECRET_EXPIRATION;

    if (!secretKey || !expiresIn) {
      throw new Error(
        "Secret key or expiration not provided in environment variables"
      );
    }

    // Generate token using jwt.sign()
    const token = jwt.sign({ userId }, secretKey, { expiresIn });

    return token;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new Error("Error generating token for user: " + error.message);
    } else {
      throw error;
    }
  }
};

// function for registering the user inside the database
const registerToDatabase = async (
  name: string,
  email: string,
  password: string,
  mobile: string,
  image: string
): Promise<{ message: string }> => {
  try {
    // logic for registering the user in the database
    const newUser = new User({
      name,
      email,
      password,
      mobile,
      image,
    });

    // saving the user inside the database
    await newUser.save();

    return { message: "User registration successful" };
  } catch (error) {
    console.error(`Error Registering the User! : ${error}`);
    throw new Error("Error registering the User!");
  }
};

// function for finding if the user is already registered
const isAlreadyRegistered = async (email: string): Promise<object | null> => {
  try {
    // logic for finding the user by email and password
    const user = await User.findOne({
      email,
    });

    // if user is not found
    if (!user) {
      // no user is found
      return { message: "User not found" };
    }

    return user.toObject();
  } catch (error) {
    console.error(`Error finding the User! : ${error}`);
    throw new Error("Error finding the User in the Database!");
  }
};

// checking if the user is verified or not
// Function to check if the user is verified or not
const isVerified = async (userID: string): Promise<boolean | undefined> => {
  try {
    const user = await User.findById(userID);
    return user ? user.verified : false;
  } catch (error) {
    console.error("Error checking user verification status:", error);
    return false;
  }
};

// function for listing all the users from the database except the one that is logged in & not in friend Request's List!
const listAllUsersExceptLoggedIn = async (
  userID: string
): Promise<object | undefined> => {
  try {
    const users = await User.find({
      _id: { $ne: userID },
      friendRequests: {
        $not: {
          $elemMatch: {
            userID: userID,
          },
        },
      },
      sentFriendRequests: {
        $not: {
          $elemMatch: {
            userID: userID,
          },
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
};

// function to set sender's sent friendRequest with recepient id
const updateSentFriendRequests = async (
  currentUserID: string,
  recepientUserID: string
): Promise<String | undefined> => {
  try {
    // updating the sender's sent friendRequest
    await User.findByIdAndUpdate(currentUserID, {
      $push: {
        sentFriendRequests: recepientUserID,
      },
    });
    return `Successfully updated sender's sent friendRequest with Recipient ID`;
  } catch (error) {
    console.log("error updating sender sent friend request list", error);
    return "Error updating sender sent friend request list";
  }
};

// function to set recepient's friendRequest with sender id
const updateFriendRequests = async (
  recepientUserID: string,
  currentUserID: string
): Promise<String | undefined> => {
  try {
    // updating the recepient's friendRequest
    await User.findByIdAndUpdate(recepientUserID, {
      $push: {
        friendRequests: currentUserID,
      },
    });
    return `Successfully updated recepient's friendRequest with Sender ID`;
  } catch (error) {
    console.log("error updating recepient friend request list", error);
    return "Error updating recepient friend request list";
  }
};

// function for fetching the friend request of the current logged-in user
const fetchFriendRequests = async (
  currentUserID: string
): Promise<UserInterface | null> => {
  try {
    return await User.findById(currentUserID)
      .populate("friendRequests", "name email image")
      .lean();
  } catch (error) {
    console.log("Error fetching friend requests of the user", error);
    throw new Error("Error fetching friend requests of the user");
  }
};

// function for accepting the friend Requests
const acceptFriendRequest = async (userID: string, recepientID: string) => {
  try {
    // Convert strings to ObjectId
    const senderId = new mongoose.Types.ObjectId(userID);
    const recepientId = new mongoose.Types.ObjectId(recepientID);

    // checking for the id's if they are valid or not
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    // ensure that both sender and the recepient are valid
    if (!sender || !recepient) {
      throw new Error("Invalid sender or recipient ID.");
    }

    // pushing the id's into the friends field in the database!
    sender.following.push(recepientId);
    recepient.followers.push(senderId);

    // removing the id's from sentFriendRequest and friendRequest!
    recepient.friendRequests = recepient.friendRequests.filter(
      (requests) => requests !== senderId
    );
    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (requests) => requests !== recepientId
    );

    // Save the changes to the database
    await sender.save();
    await recepient.save();
  } catch (error) {
    console.log("Error accepting friend requests of the user", error);
    throw new Error("Error accepting friend requests of the user");
  }
};

// function to fetch all the followers of the user
const fetchFollowers = async ( userID: string ): Promise < UserInterface | null > => {
    try {
        return await User.findById(userID).populate('followers', "name email mobile image is_online followers following uploadedMovies")
    } catch (error) {
        console.log('Error fetching followers', error);
        throw error;
    }
}

// function for fetching all the followings of the user
const fetchFollowing = async ( userID: string ): Promise< UserInterface | null > => {
    try {
        return await User.findById(userID).populate('following', 'name email mobile image is_online followers following uploadedMovies')
    } catch (error) {
        console.log('error fetching following', error);
        throw error;
    }
}

export {
  findUserByEmailAndPassword,
  generateToken,
  registerToDatabase,
  isAlreadyRegistered,
  isVerified,
  listAllUsersExceptLoggedIn,
  updateSentFriendRequests,
  updateFriendRequests,
  fetchFriendRequests,
  acceptFriendRequest,
  fetchFollowers,
  fetchFollowing
};

// Intel
// Microsoft
// Paytm Payment Banks
