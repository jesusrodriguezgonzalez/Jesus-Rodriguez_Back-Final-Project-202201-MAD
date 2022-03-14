import express from 'express';
const router = express.Router();

import * as controller from '../controllers/apartments.controllers';

router.get('/', controller.getAllApartments);
router.get('/:id', controller.getApartment);
router.patch('/:id', controller.updateApartment);
router.post('/:id', controller.newApartment);
router.delete('/:id', controller.deleteApartment);

export default router;
