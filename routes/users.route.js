import express from 'express';
const router = express.Router();

import * as controller from '../controllers/users.controllers.js';
import { loginRequired } from '../middleware/login-control.js';

router.post('/login', controller.login);
router.post('/register', controller.registerUser);
router.get('/', loginRequired, controller.getAllUsers);
router.patch('/:id', loginRequired, controller.updateUser);

export default router;
