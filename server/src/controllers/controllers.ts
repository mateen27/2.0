import { Request, Response } from "express";
import User from "../models/userModel";
import {
  acceptFriendRequest,
  fetchFollowers,
  fetchFollowing,
  fetchFriendRequests,
  fetchPosts,
  fetchUserFollowersHandler,
  fetchUserFollowingHandler,
  fetchUserPosts,
  findPostById,
  findUserByEmailAndPassword,
  findUserByID,
  generateToken,
  isAlreadyRegistered,
  listAllUsersExceptLoggedIn,
  registerToDatabase,
  updateFriendRequests,
  updateSentFriendRequests,
  updateUserUploadedPosts,
} from "../services/authService";
import mongoose from "mongoose";
import Post, { PostInterface } from "../models/postModel";

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

    res.status(200).json( {users} );
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
    const { userID } = req.params;
    const { recepientID } = req.body;

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

// logic for uploading the post to the server
const uploadPostHandler = async ( req: Request, res: Response ) => {
    try {
        // accessing the userID from the params
        const { userID } = req.params;
        const { type, contentUrl, contentDescription } = req.body;

        // checking if the user exists or not
        const existingUser = await User.findById(userID);

        if ( !existingUser ) {
            return res.status(404).json({ message: "User not found" });
        }

        // creating the post for the user
        const newPost: PostInterface = new Post({
            type,
            contentUrl,
            contentDescription,
            userID,
            likes: [],
            comments: []
        })

        // save the post to the database
        const savedPost = await newPost.save();

        // update the user's uploadedPosts array with the new post's ID
        await updateUserUploadedPosts(userID, savedPost);

        res.status(201).json({ message: 'Post uploaded successfully', post: savedPost });

    } catch (error) {
        console.log('error uploading the post', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// endpoint for deleting the post uploaded by the user
const deletePostHandler = async ( req: Request, res: Response ) => {
  try {
    // accessing the userID from params and postID from the body
    const { userID } = req.params;
    const { postID } = req.body;

    // checking if the user exists or not
    const existingUser = await findUserByID(userID);
    // user not found 
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
  }

  // checking if the post exists or not
  const post = await findPostById(postID);

  // post not found
  if ( !post ) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!post.userID.equals(userID)) {
    return res.status(403).json({ message: 'You are not authorized to delete this post' });
}

// Delete the post
await Post.deleteOne({ _id: postID });


// Remove the post from the user's uploadedPosts array
await User.findByIdAndUpdate(userID, { $pull: { uploadedPosts: postID } });

res.status(200).json({ message: 'Post deleted successfully' });


  } catch (error) {
    console.log('error deleting the post uploaded by the user', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// endpoint for udating the description of the user post which he have uploaded
const updatePostDescriptionHandler = async ( req: Request, res: Response ) => {
  try {
    // accessing the userID from the params and accessing the post ID and description from the body
    const { userID } = req.params;
    const { postID, description } = req.body;
    const userIDObj = new mongoose.Types.ObjectId(userID)

    // checking if the post exists or not
    const post = await findPostById(postID);
     if ( !post ) {
       return res.status(404).json({ message: 'Post not found' });
     }

    //  console.log('post log', post.userID);
    //  console.log('userID Object ', userIDObj);
    //  console.log('is equal or not', post.userID.equals(userIDObj));

     // Verify that the user is authorized to modify the post
     if (!post.userID.equals(userIDObj)) {
      return res.status(403).json({ message: 'You are not authorized to modify this post' });
  }

  // Update the description of the post
  post.contentDescription = description;
  const updatedPost = await post.save();

  res.status(200).json({ message: 'Post description updated successfully', post: updatedPost })
  } catch (error) {
    console.log('error updating the description of the user', error)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// endpoint for displaying the posts on to the feed of the application
const postHandler = async ( req: Request, res: Response ) => {
  try {
    // fetching the posts fro the feed
    const posts = await fetchPosts();

    return res.status(200).json({ message: 'Posts fetched successfully', post: posts });
  } catch (error) {
    console.log('error fetching the posts on to the feed of the application', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// endpoint for fetching the posts of the logged in user
const userPostHandler = async ( req: Request, res: Response ) => {
  try {
    // accessing the userID from the parameters
    const { userID } = req.params;

    // checking if the user is authenticated
    const user = await findUserByID(userID);
    // user does not exist
    if ( !user ) {
      res.status(404).json({ message: 'User not found' });
    }

    // fetching the user's posts from the database
    const posts = await fetchUserPosts(userID);

    return res.status(200).json({ message: 'Posts successfully fetched', post: posts});
  } catch (error) {
    console.log('error fetching the posts of the logged in user', error);
    res.status(500).json({ message: 'Error fetching the posts of the logged in user' });
  }
}

// endpoint for fetching the posts of the specific user
const fetchPostsHandler = async (req: Request, res: Response ) => {
  try {
    // accesing the posts of the user only when the user is following the user
    const { userID } = req.params;
    const { recipientID } = req.body;

    // Checking if the current user is following the recipient
    const currentUser = await User.findById(userID);
    const isFollowing = currentUser?.following.includes(recipientID);

    // when the user is not following the user
    if ( !isFollowing ) {
      return res.status(403).json({ message: `You are not authorized to view this user\'s posts` });
    }

    // fetch the users posts
    const post = await Post.find({ userID: recipientID }).populate('userID', 'name email');

    res.status(200).json({post});
  } catch (error) {
    console.log('error fetching posts of the specific user', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// endpoint for liking the post of the user and notifying the user
const likePostsHandler = async (req: Request, res: Response) => {
  try {
    // accessing the userID from the parameters
    const { userID } = req.params;
    // accessing the postID from the body
    const { postID } = req.body;

    const userIDObj = new mongoose.Types.ObjectId(userID);
    const postIdObj = new mongoose.Types.ObjectId(postID);

    // checking if the user exists or not
    const existingUser = await User.findById(userIDObj);
    // user not found
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // checking if the post exists or not
    const post = await Post.findById(postIdObj);
    // post not found
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // checking if the user has already liked the post
    if (post.likes.includes(userIDObj)) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    // if the user has not liked the post yet
    post.likes.push(userIDObj);
    await post.save();

    // notifying the user who has uploaded the post
    const author: any = await User.findById(post.userID);
    
    // console.log(typeof author);
    // console.log(author)

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.log('Error liking post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


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
  fetchFollowingHandler,
  uploadPostHandler,
  deletePostHandler,
  updatePostDescriptionHandler,
  postHandler,
  userPostHandler,
  fetchPostsHandler,
  likePostsHandler
};
