import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function createAccessToken(payload) {
    console.log(process.env.TOKEN_SECRET);
    return new Promise((res, rej) => {
        jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" }, 
        (err, token) => {
            if (err) return rej(err); // Reject on error and exit early
            res(token); // Resolve only when token is successfully created
        });
    });
};