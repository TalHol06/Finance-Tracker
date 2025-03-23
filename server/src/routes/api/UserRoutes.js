import { getAllUsers, getUser, createUser, login, logout,removeAllUsers } from '../../controllers/UserControllers.js';
import { Router } from 'express';

const router = Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/clean').delete(removeAllUsers);
router.route('/:id').get(getUser);


export { router as UserRouter };