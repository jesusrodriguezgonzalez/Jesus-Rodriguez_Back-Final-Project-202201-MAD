import express from 'express';
const router = express.Router();

import * as controller from '../controllers/users.controllers.js';

router.post('/login', controller.login);
router.post('/register', controller.registerUser);
router.get('/', controller.getAllUsers);
router.patch('/:id', controller.updateUser);

export default router;
