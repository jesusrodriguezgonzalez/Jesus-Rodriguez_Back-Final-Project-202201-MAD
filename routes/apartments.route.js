import express from 'express';
const router = express.Router();

import * as controller from '../controllers/apartments.controllers';

router.get('/', controller.getAllApartments);
router.get('/', controller.getApartment);
router.post('/', controller.newApartment);
router.delete('/:id', controller.deleteApartment);
router.patch('/:id', controller.updateApartment);

export default router;
