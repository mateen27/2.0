import bcrypt from 'bcryptjs';
// file holding all the logic part of the application.

import { UserInterface } from "./../models/userModel";
import User from "../models/userModel";
import Chat from "../models/chatModel";
import jwt from "jsonwebtoken";

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
            throw new Error("Secret key or expiration not provided in environment variables");
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
}

// function for registering the user inside the database
const registerToDatabase = async (name: string, email: string, password: string, mobile: string, image: string): Promise<{ message: string }> => {
    try {
        // logic for registering the user in the database
        const newUser = new User({
            name,
            email,
            password,
            mobile,
            image,
        })

        // saving the user inside the database
        await newUser.save();

        return { message: 'User registration successful' };
    } catch (error) {
        console.error(`Error Registering the User! : ${error}`);
        throw new Error("Error registering the User!");
    }
}

// function for finding if the user is already registered
const isAlreadyRegistered = async ( email: string ): Promise<object | null> => {
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
}

// checking if the user is verified or not
// Function to check if the user is verified or not
const isVerified = async (userID: string): Promise<boolean | undefined> => {
    try {
        const user = await User.findById(userID);
        return user ? user.verified : false;
    } catch (error) {
        console.error('Error checking user verification status:', error);
        return false;
    }
};

// function for listing all the users from the database except the one that is logged in & not in friend Request's List!
const listAllUsersExceptLoggedIn = async (userID: string): Promise<object | undefined> => {
    try {
        const users = await User.find({ _id: { $ne: userID } });

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error fetching users");
    }
}

export { findUserByEmailAndPassword, generateToken, registerToDatabase, isAlreadyRegistered, isVerified, listAllUsersExceptLoggedIn };
