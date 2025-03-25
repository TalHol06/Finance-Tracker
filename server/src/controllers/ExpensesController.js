import { Expenses, Finances } from "../models/index.js";

// Gets all user expenses
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expenses.find();

        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while fetching expenses: ${err.message}` });
    }
}

export const getExpenseById = async (req, res) => {
    const { expenseId } = req.params;

    try {
        const expense = await Expenses.findById(expenseId);

        if (!expense){
            return res.status(404).json({ message: "Expense by that id not found." });
        }

        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while trying to fetch expense: ${err.message}` });
    }
}

// Get all of a specific users expenses
export const getAllUserExpenses = async (req, res) => {
    const { financeId } = req.params;
    try {
        const userFinances = await Finances.findById(financeId);

        if (!userFinances){
            return res.status(404).json({ message: "Finance by that id not found." });
        }

        console.log("User Finances: \n", userFinances, "\n\n");
        console.log("User Expenses: \n", userFinances.expenses, "\n\n");

        if (userFinances.expenses.length === 0){
            return res.json(expensesArray);
        }

        const expensesArray = await Promise.all(
            userFinances.expenses.map(async (element) => {
                const expense = await Expenses.findById(element._id);
                return expense;
            })
        );

        res.json(expensesArray);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while trying to fetch expense: ${err.message}`});
    }
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

export const removeAllExpenses = async (req, res) => {
    try {
        const expenses = await Expenses.deleteMany();

        await Finances.cleanIndexes
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while trying to remove expenses: ${err.message}` });
    }
}

export const removeUserExpense = async (req, res) => {
    console.log("Route hit");
    const { expenseId, financeId } = req.params;
    console.log(expenseId, financeId);

    try {
        const expense = await Expenses.findByIdAndDelete(expenseId);
        console.log(expense);

        if (!expense) {
            return res.status(404).json({ message: "Expense by that ID not found" });
        }

        const updatedFinances = await Finances.findByIdAndUpdate(
            financeId,
            { $pull: { expenses: expenseId } },
            { new: true }
        );
        console.log(updatedFinances);

        res.json(updatedFinances);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while trying to delete your expense: ${err.message}` });
    }
};
