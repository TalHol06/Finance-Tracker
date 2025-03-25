import { getAllExpenses, getExpenseById, getAllUserExpenses, AddExpense, removeAllExpenses, removeUserExpense } from "../../controllers/ExpensesController.js";
import { Router } from 'express';

const router = Router();

router.route('/').get(getAllExpenses);
router.route('/:expenseId').get(getExpenseById);
router.route('/finances/:financeId').get(getAllUserExpenses).post(AddExpense);
router.route('/clean').delete(removeAllExpenses);
router.route('/:expenseId/finance/:financeId').delete(removeUserExpense);

export { router as ExpenseRoutes };