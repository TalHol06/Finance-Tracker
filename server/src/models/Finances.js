import mongoose, { Schema } from "mongoose";

const FinancesSchema = new Schema(
    {
        netMonthlyIncome: {
            type: Number,
            required: true,
            min: [1, "Please enter a valid net income."],
        },
        budgetType: {
            type: String,
            required: true,
            enum: ['50/30/20', 'Reverse-Budgeting', 'Z-B-Budgeting'],
            trim: true
        },
        expenses: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Expenses'
                }
            ],
            default: []
        }
    },
    {
        id: false
    }
);

const Finances = mongoose.model('Finances', FinancesSchema);
export default Finances;