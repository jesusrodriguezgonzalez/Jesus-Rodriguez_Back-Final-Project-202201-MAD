import express from 'express';
const router = express.Router();

import * as controller from '../controllers/incidents.controllers.js';
import { checkCreatorIncidents } from '../middleware/checkCreatorIncidents.js';
import { loginRequired } from '../middleware/login-control.js';
router.get('/', loginRequired, controller.getAllIncidents);
router.get('/', loginRequired, controller.getIncidents);
router.post('/', loginRequired, controller.newIncident);
router.delete(
    '/:id',
    loginRequired,
    checkCreatorIncidents,
    controller.deleteIncident
);
router.patch('/:id', loginRequired, controller.updateIncident);

export default router;
