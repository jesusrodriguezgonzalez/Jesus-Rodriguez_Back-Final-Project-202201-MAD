import express from 'express';
const router = express.Router();

import * as controller from '../controllers/apartments.controllers.js';

router.get('/', controller.getAllApartments);
router.get('/:id', controller.getApartment);
router.patch('/:id', controller.updateApartment);
router.post('/', controller.newApartment);
router.delete('/:id', controller.deleteApartment);

export default router;
