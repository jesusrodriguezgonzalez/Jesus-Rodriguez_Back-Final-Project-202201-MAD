import express from 'express';
const router = express.Router();

import * as controller from '../controllers/apartments.controllers.js';
import { loginRequired } from '../middleware/login-control.js';

router.get('/', loginRequired, controller.getAllApartments);
router.get('/:id', loginRequired, controller.getApartment);
router.patch('/:id', loginRequired, controller.updateApartment);
router.post('/', loginRequired, controller.newApartment);
router.delete('/:id', loginRequired, controller.deleteApartment);

export default router;
