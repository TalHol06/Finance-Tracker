import { User, Finances } from "../models/index.js";

export const getAllUserFinances = async (req, res) => {
    try {
        const finances = await Finances.find();
        res.status(200).json(finances);
    } catch (err) {
        res.status(500).json({ message: `Error fetching all user finances: ${err.message}.` });
    }
}

export const getUserFinances = async (req, res) => {
    const { financeId } = req.params;

    try {
        const finance = await Finances.findById(financeId);
        if (!finance){
            return res.status(404).json({ message: "Finance by that id not found." });
        }

        res.status(200).json(finance);
    } catch (err) {
        res.status(500).json({ message: `Error fetching user finances: ${err.message}` });
    }
}

export const addFinances = async (req, res) => {
    const { userId } = req.params;
    const { netMonthlyIncome, budgetType } = req.body;

    if (!netMonthlyIncome || !budgetType){
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newFinances = await Finances.create({ netMonthlyIncome, budgetType });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { finances: newFinances._id } },
            { new: true }
        ).populate('finances');

        res.status(201).json({ finance: newFinances, user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: `Error occurred while trying to add your finances: ${err.message}` });
    }
}

export const updateFinances = async (req, res) => {
    const { financeId, userId } = req.params;
    const { newIncome, newBudget } = req.body;

    if (!financeId || !newIncome) return res.status(400).json({ message: 'All fields are required.' });

    try {
        const updatedFinance = await Finances.findByIdAndUpdate(
            financeId,
            { $set: { netMonthlyIncome: newIncome, budgetType: newBudget } },
            { new: true}
        );

        if (!updatedFinance) return res.status(404).json({ message: 'Finance by that id not found.' });
        

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { finances: updatedFinance } },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'User by that id not found.' });

        res.json({ newFinances: updatedFinance, newUser: updatedUser });
    } catch (err) {
        res.status(500).json({ message: `Error occurred while updating your income: ${err.message}` });
    }
}

export const cleanUserFinances = async (req, res) => {
    try {
        const finances = await Finances.deleteMany();
        res.json(finances);
    } catch (err) {
        res.status(500).json({ message: `Error occurred while deleting finances: ${err.message}` });
    }
}