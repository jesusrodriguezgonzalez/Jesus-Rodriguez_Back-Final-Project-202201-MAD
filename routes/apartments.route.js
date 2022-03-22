import express from 'express';
const router = express.Router();

import * as controller from '../controllers/apartments.controllers.js';
import { isOwner } from '../middleware/isOwner.js';
import { loginRequired } from '../middleware/login-control.js';

router.get('/', loginRequired, controller.getAllApartments);
router.get('/:id', loginRequired, controller.getApartment);
router.patch('/:id', loginRequired, isOwner, controller.updateApartment);
router.post('/', controller.newApartment);
router.delete('/:id', loginRequired, isOwner, controller.deleteApartment);
router.patch('/add-tenant/:id', loginRequired, isOwner, controller.addTenat);

export default router;
