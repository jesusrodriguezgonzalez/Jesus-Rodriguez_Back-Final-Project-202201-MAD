import express from 'express';
const router = express.Router();

import * as controller from '../controllers/incidents.controllers.js';

router.get('/', controller.getAllIncidents);
router.get('/', controller.getIncidents);
router.post('/', controller.newIncident);
router.delete('/:id', controller.deleteIncident);
router.patch('/:id', controller.updateIncident);

export default router;