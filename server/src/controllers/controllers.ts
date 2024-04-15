import { Request , Response } from "express"
import User from "../models/userModel";
import { findUserByEmailAndPassword, generateToken, registerToDatabase } from "../services/authService";

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
        const { name, email, password, mobile, image } = req.body;

        // Calling a function in the service to handle database operations!
        const user = await registerToDatabase(name, email, password, mobile, image);

        res.status(201).json({ user });
    } catch (error) {
        console.error("Error Registering the user!", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { loginUserHandler, registerUserHandler };