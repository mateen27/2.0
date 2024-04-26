import Notification, { NotificationInterface } from './../models/notificationModel';
import bcrypt from "bcryptjs";
// file holding all the logic part of the application.

import { UserInterface } from "./../models/userModel";
import User from "../models/userModel";
import Chat from "../models/chatModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Post, { PostInterface } from "../models/postModel";

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
const generateToken = async (userId: UserID): Promise<String | number> => {
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
const isAlreadyRegistered = async (email: string): Promise<Object | null> => {
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
const isVerified = async (userID: string): Promise<Boolean | undefined> => {
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
): Promise<Object | undefined> => {
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

// function for fetching the friend requests of the user
const fetchFriendRequests = async (
  currentUserID: string
): Promise<{ _id: mongoose.Types.ObjectId, name: string, email: string }[]> => {
  try {
    const user = await User.findById(currentUserID).populate({
      path: "friendRequests",
      select: "name email",
      model: "User"
    }).lean<UserInterface>();
    if (!user) {
      throw new Error('User not found');
    }
    return user.friendRequests.map((friend: any) => ({
      _id: friend._id,
      name: friend.name,
      email: friend.email
    }));
  } catch (error) {
    console.log("Error fetching friend requests of the user", error);
    throw new Error("Error fetching friend requests of the user");
  }
};

// function for accepting the friend request of the users
const acceptFriendRequest = async (userID: string, recepientID: string) => {
  try {
    // Convert strings to ObjectId
    const senderId = new mongoose.Types.ObjectId(userID);
    const recepientId = new mongoose.Types.ObjectId(recepientID);

    // Query sender and recipient documents
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    // Check if sender and recipient exist
    if (!sender || !recepient) {
      throw new Error("Invalid sender or recipient ID.");
    }

    // Push sender ID to recipient's followers
    recepient.following.push(senderId);

    // Push recipient ID to sender's following
    sender.followers.push(recepientId);

    // Remove sender ID from recipient's friend requests
    recepient.sentFriendRequests = recepient.sentFriendRequests.filter(
      (requestId) => requestId.toString() !== senderId.toString()
    );

    // Remove recipient ID from sender's sent friend requests
    sender.friendRequests = sender.friendRequests.filter(
      (requestId) => requestId.toString() !== recepientId.toString()
    );

    // Save changes
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

// function for fetching all the followers of the user
const fetchUserFollowersHandler = async ( userID: string ): Promise< UserInterface | null > => {
    try {
        return await User.findById(userID).populate('followers', "name email mobile image is_online followers following uploadedMovies");
    } catch (error) {
        console.log('error fetching followers of the specified user', error);
        throw error;
    }
}

// function for fetching all the followings of the user
const fetchUserFollowingHandler = async ( userID: string ): Promise< UserInterface | null > => {
    try {
        return await User.findById(userID).populate('following', 'name email mobile image is_online followers following uploadedMovies');
    } catch (error) {
        console.log('error fetching user following', error);
        throw error;
    }
}

// function for finding the user by its id
const findUserByID = async ( userID: string ): Promise< Boolean | null > => {
    try {
        // checking if the user is already present with this user id or not
        const existingUser = await User.findById(userID);
        // if not present
        if (!existingUser) {
            return false;
        }
        return true;

    } catch (error) {
        console.log('error finding the user by its userID', error);
        throw error;
    }
}

// function for updating the user's uploaded posts data in the backend
const updateUserUploadedPosts = async ( userID: string, savedPost: any ) => {
    try {
        return await User.findByIdAndUpdate(userID, { $push: {
            uploadedPosts: savedPost._id
        }})
    } catch (error) {
        console.log('error updating the user uploaded posts data', error);
        throw error;
    }
}

// function for finding the post by its ID
const findPostById = async (postID: string): Promise<PostInterface | null> => {
  try {
    // Use findById to directly retrieve the post from the database
    const existingPost = await Post.findById(postID);
    
    // If post is not found, return null
    if (!existingPost) {
      return null;
    }

    // If post is found, return the Mongoose model instance
    return existingPost;
  } catch (error) {
    console.log('Error finding the post by the post ID', error);
    throw error;
  }
};


// function to fetch the posts from the database to display them on the feed list
const fetchPosts = async (): Promise<PostInterface[]> => {
  try {
    const posts = await Post.find().populate('userID', 'name email followers').lean();

    return posts;
  } catch (error) {
    console.log('error fetching posts', error);
    throw error;
  }
}

// function for fetching the loggedin user's posts
const fetchUserPosts = async ( userID: string ): Promise<PostInterface[]> => {
  try {
    // fetching the posts of the user from the database
    const posts = await Post.find({ userID }).populate('userID', 'name email').lean();

    return posts;
  } catch (error) {
    console.log('error fetching the user posts', error);
    throw error;
  }
}

// Function to create and save notifications
const createNotification = async (recipientID: string, message: string, type: string, postId: string) => {
  try {
      const notification: NotificationInterface = new Notification({
          message: message,
          type: type,
          postId: postId,
          userId: recipientID,
      });
      await notification.save();
  } catch (error) {
      throw new Error('Error creating notification');
  }
};


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
  fetchFollowing,
  fetchUserFollowersHandler,
  fetchUserFollowingHandler,
  findUserByID,
  updateUserUploadedPosts,
  findPostById,
  fetchPosts,
  fetchUserPosts,
  createNotification
};

// Intel
// Microsoft
// Paytm Payment Banks
