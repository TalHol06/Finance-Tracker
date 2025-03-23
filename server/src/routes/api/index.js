import { UserRouter } from "./UserRoutes.js";
import { FinanceRoutes } from "./FinanceRoutes.js";
import { Router } from "express";

const router = Router();

router.use('/user', UserRouter);
router.use('/finances', FinanceRoutes);

export default router;