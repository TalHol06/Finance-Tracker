import { getAllUserFinances, getUserFinances, addFinances } from "../../controllers/FinancesController.js";
import { Router } from "express";

const router = Router();

router.route('/').get(getAllUserFinances);
router.route('/:userId').post(addFinances);
router.route('/:financeId').get(getUserFinances);

export { router as FinanceRoutes };