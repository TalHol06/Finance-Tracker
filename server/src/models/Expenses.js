import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, "Your expense must have a name."]
        },
        category: {
            type: String,
            trim: true,
            enum: ["Housing", "Transportation", "Food", "Utilities", "Clothing", "Medical/Healthcare", "Insurance", "Household Items", "Personal", "Savings"]
        },
        description: {
            type: String,
            trim: true,
        },
        cost: {
            type: Number,
            required: true,
            min: [0, "Cost must be a positive number."]
        }
    },
    {
        id: false
    }
);

const Expenses = mongoose.model('Expenses', ExpenseSchema);
export default Expenses;