import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log(`Connected to the Database successfully!`);
        return mongoose.connection;
    } catch (err) {
        console.error(`Database connection error: ` +err);
    }
}

export default db;