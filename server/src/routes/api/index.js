import { UserRouter } from "./UserRoutes.js";
import { FinanceRoutes } from "./FinanceRoutes.js";
import { ExpenseRoutes } from "./ExpenseRoutes.js";
import { Router } from "express";

const router = Router();

router.use('/user', UserRouter);
router.use('/finances', FinanceRoutes);
router.use('/expenses', ExpenseRoutes);

export default router;