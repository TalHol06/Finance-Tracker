import { Expenses, Finances } from "../models/index.js";

// Gets all user expenses
export const getAllExpenses = async (req, res) => {

}

// Get all of a specific users expenses
export const getAllUserExpenses = async (req, res) => {

}

// Add an expense
export const AddExpense = async (req, res) => {
    const { financeId } = req.params;
    const { name, category, description, cost } = req.body;

    if (!name || !category || !description || !cost){
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newExpense = await Expenses.create({ name, category, description, cost });
        
        const updatedFinances = await Finances.findByIdAndUpdate(
            financeId,
            { $push: { expenses: newExpense._id } },
            { new: true }
        ).populate('expenses');

        if (!updatedFinances){
            return res.status(404).json({ message: "Finances by that id not found." });
        }

        res.json(updatedFinances);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while trying to add your expense: ${err.message}` });
    }
}