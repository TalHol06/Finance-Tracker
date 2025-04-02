import { getAllUserFinances, getUserFinances, addFinances, cleanUserFinances, updateFinances } from "../../controllers/FinancesController.js";
import { Router } from "express";

const router = Router();

router.route('/').get(getAllUserFinances);
router.route('/:userId').post(addFinances);
router.route('/:financeId').get(getUserFinances);
router.route('/:financeId/user/:userId').put(updateFinances);
router.route('/clean').delete(cleanUserFinances);

export { router as FinanceRoutes };