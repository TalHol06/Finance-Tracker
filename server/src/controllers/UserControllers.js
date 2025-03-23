import { User } from "../models/index.js";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all users in the database
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while fetching users: ${err.message}.`});
    }
}

// Gets a single user by Id
export const getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).populate();

        if (!user){
            return res.status(404).json({ message: 'User by that id does not exist.'});
        }

        const safeUser = {
            email: user.email,
            finances: user.finances,
            id: user._id
        };

        res.status(200).json(safeUser);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while fetching your user: ${err.message}.`});
    }
}

// Creates an account
export const createUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword });

        if (!newUser){
            return res.status(400).json({ message: "Error occurred while creating your account." });
        }

        const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie("token", token);

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while creating your account: ${err.message}.`});
    }
}

// Controller for logging in
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ message: "All fields are required."});
    }

    try {
        const userFound = await User.findOne({ email });
        if (!userFound){
            return res.status(404).json({ message: "Account using that email not found." });
        }

        const isMatch = bcrypt.compare(password, userFound.password);
        if (!isMatch){
            return res.status(404).json({ message: "Incorrect password." });
        }

        const token = jwt.sign({ id: userFound._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie("token", token);

        res.json({ message: "Successfully Logged in!" });
    } catch (err) {
        res.status(500).json({message: `Error occurred while trying to login: ${err.message}`});
    }
}

// Logs the user out
export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            expiresIn: new Date(0)
        });
        return res.status(200).json({ message: 'Successfully logged out!' });
    } catch (err) {
        res.status(500).json({ message: `Error logging you out of your account: ${err.message}` });
    }
}

// Cleans Database
export const removeAllUsers = async (_req, res) =>{
    try {
        const users = await User.deleteMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error occurred while deleting users." });
    }
}